import express from "express";
import { PaymentControllers } from "../controllers/payment.controllers";
import auth from "../middlewares/auth";

const router = express.Router();

// POST /payments - Create a new payment
router.post("/", auth("client"), PaymentControllers.createPayment);

// GET /payments/:id - Get specific payment
router.get("/:id", auth(), PaymentControllers.getPaymentById);

// GET /payments - Get user's payments
router.get("/", auth(), PaymentControllers.getUserPayments);

// GET /payments/project/:projectId - Get all payments for a project
router.get("/project/:projectId", auth(), PaymentControllers.getProjectPayments);

// PUT /payments/:id - Update a payment (admin only)
router.put("/:id", auth("admin"), PaymentControllers.updatePayment);

// DELETE /payments/:id - Delete a payment (admin only)
router.delete("/:id", auth("admin"), PaymentControllers.deletePayment);

export const paymentRoutes = router;
