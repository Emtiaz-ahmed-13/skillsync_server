import { Request, Response } from "express";
import { PaymentServices } from "../services/payment.services";
import catchAsync from "../utils/catchAsync";
import { NotificationEvents } from "../utils/notification.events";
import sendResponse from "../utils/sendResponse";
import { StripeUtils } from "../utils/stripe.utils";

const createPayment = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const result = await PaymentServices.createPayment({
    ...req.body,
    clientId: req.user?.id || req.user?._id,
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Payment created successfully",
    data: result,
  });
});

const getPaymentById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PaymentServices.getPaymentById(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment retrieved successfully",
    data: result,
  });
});

const getUserPayments = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const userId = req.user?.id || req.user?._id;
  const userRole = req.user?.role;
  const { limit = 10, page = 1 } = req.query;

  const result = await PaymentServices.getUserPayments(
    userId,
    userRole,
    parseInt(limit as string),
    parseInt(page as string),
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User payments retrieved successfully",
    data: result,
  });
});

const updatePayment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PaymentServices.updatePayment(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment updated successfully",
    data: result,
  });
});

const deletePayment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PaymentServices.deletePayment(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment deleted successfully",
    data: result,
  });
});

const getProjectPayments = catchAsync(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const result = await PaymentServices.getProjectPayments(projectId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Project payments retrieved successfully",
    data: result,
  });
});

const createPaymentIntent = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const { amount, currency = "usd", milestoneId, projectId, freelancerId } = req.body;
  const clientId = req.user?.id || req.user?._id;

  // Create Stripe payment intent
  const paymentIntent = await StripeUtils.createPaymentIntent(
    amount * 100, // Convert to cents
    currency,
    { milestoneId, projectId, clientId, freelancerId }
  );

  // Create payment record
  const payment = await PaymentServices.createPayment({
    projectId,
    milestoneId,
    clientId,
    freelancerId,
    amount,
    currency,
    stripePaymentIntentId: paymentIntent.id,
    status: "processing",
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Payment intent created successfully",
    data: {
      payment,
      clientSecret: paymentIntent.clientSecret,
    },
  });
});

const handleStripeWebhook = catchAsync(async (req: Request, res: Response) => {
  const event = req.body;

  // Handle different event types
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;

      // Update payment status
      const payment = await PaymentServices.updatePayment(
        paymentIntent.metadata.paymentId,
        {
          status: "completed",
          paidAt: new Date(),
          transactionId: paymentIntent.id,
        }
      );

      // Send notification to freelancer
      if (payment) {
        await NotificationEvents.notifyPaymentReceived(
          payment.id as string,
          payment.amount,
          payment.currency,
          payment.freelancerId as any,
          payment.clientId as any,
          payment.projectId as any,
        );
      }
      break;

    case "payment_intent.payment_failed":
      const failedIntent = event.data.object;
      await PaymentServices.updatePayment(
        failedIntent.metadata.paymentId,
        { status: "failed" }
      );
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Webhook processed successfully",
    data: null,
  });
});

export const PaymentControllers = {
  createPayment,
  getPaymentById,
  getUserPayments,
  updatePayment,
  deletePayment,
  getProjectPayments,
  createPaymentIntent,
  handleStripeWebhook,
};
