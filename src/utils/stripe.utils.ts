import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-11-17.clover",
});

/**
 * Create a payment intent
 */
const createPaymentIntent = async (
  amount: number,
  currency: string = "usd",
  metadata?: Record<string, string>,
) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata,
    });

    return {
      id: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      status: paymentIntent.status,
    };
  } catch (error: any) {
    throw new Error(`Failed to create payment intent: ${error.message}`);
  }
};

/**
 * Confirm a payment intent
 */
const confirmPaymentIntent = async (paymentIntentId: string) => {
  try {
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);
    return {
      id: paymentIntent.id,
      status: paymentIntent.status,
    };
  } catch (error: any) {
    throw new Error(`Failed to confirm payment intent: ${error.message}`);
  }
};

/**
 * Refund a payment
 */
const refundPayment = async (paymentIntentId: string, amount?: number, reason?: string) => {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount,
      reason: reason as Stripe.RefundCreateParams.Reason,
    });

    return {
      id: refund.id,
      status: refund.status,
      amount: refund.amount,
    };
  } catch (error: any) {
    throw new Error(`Failed to refund payment: ${error.message}`);
  }
};

/**
 * Create a customer
 */
const createCustomer = async (email: string, name?: string, metadata?: Record<string, string>) => {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata,
    });

    return {
      id: customer.id,
      email: customer.email,
      name: customer.name,
    };
  } catch (error: any) {
    throw new Error(`Failed to create customer: ${error.message}`);
  }
};

/**
 * Attach a payment method to a customer
 */
const attachPaymentMethodToCustomer = async (customerId: string, paymentMethodId: string) => {
  try {
    const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

    return {
      id: paymentMethod.id,
      type: paymentMethod.type,
    };
  } catch (error: any) {
    throw new Error(`Failed to attach payment method: ${error.message}`);
  }
};

export const StripeUtils = {
  createPaymentIntent,
  confirmPaymentIntent,
  refundPayment,
  createCustomer,
  attachPaymentMethodToCustomer,
};
