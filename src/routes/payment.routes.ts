import express from "express";
import { PaymentControllers } from "../controllers/payment.controllers";
import auth from "../middlewares/auth";

const router = express.Router();

router.post("/", auth("client"), PaymentControllers.createPayment);
router.post("/create-intent", auth("client"), PaymentControllers.createPaymentIntent);
router.post("/webhook", PaymentControllers.handleStripeWebhook); // No auth for webhooks
router.get("/:id", auth(), PaymentControllers.getPaymentById);
router.get("/", auth(), PaymentControllers.getUserPayments);
router.get("/project/:projectId", auth(), PaymentControllers.getProjectPayments);
router.put("/:id", auth("admin"), PaymentControllers.updatePayment);
router.delete("/:id", auth("admin"), PaymentControllers.deletePayment);

export const paymentRoutes = router;
