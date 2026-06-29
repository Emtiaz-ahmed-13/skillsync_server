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

  const payment = await PaymentServices.createPayment({
    projectId,
    milestoneId,
    clientId,
    freelancerId,
    amount,
    currency,
    status: "processing",
  });

  const paymentId = (payment as any)._id?.toString() || (payment as any).id;

  const paymentIntent = await StripeUtils.createPaymentIntent(
    amount * 100,
    currency,
    {
      paymentId,
      milestoneId: milestoneId || "",
      projectId,
      clientId: clientId.toString(),
      freelancerId,
    },
  );

  await PaymentServices.updatePayment(paymentId, {
    stripePaymentIntentId: paymentIntent.id,
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
  const signature = req.headers["stripe-signature"] as string;

  if (!signature) {
    return res.status(400).json({ success: false, message: "Missing Stripe signature" });
  }

  let event;
  try {
    event = StripeUtils.verifyWebhookEvent(req.body, signature);
  } catch (error: any) {
    console.error("Stripe webhook verification failed:", error.message);
    return res.status(400).json({ success: false, message: "Invalid webhook signature" });
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as { id: string };
      const payment = await PaymentServices.updatePaymentByIntentId(paymentIntent.id, {
        status: "completed",
        paidAt: new Date(),
        transactionId: paymentIntent.id,
      });

      await NotificationEvents.notifyPaymentReceived(
        payment._id?.toString() || (payment as any).id,
        payment.amount,
        payment.currency,
        payment.freelancerId as any,
        payment.clientId as any,
        payment.projectId as any,
      );
      break;
    }
    case "payment_intent.payment_failed": {
      const failedIntent = event.data.object as { id: string };
      await PaymentServices.updatePaymentByIntentId(failedIntent.id, { status: "failed" });
      break;
    }
    default:
      console.log(`Unhandled Stripe event type: ${event.type}`);
  }

  return res.status(200).json({ received: true });
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
