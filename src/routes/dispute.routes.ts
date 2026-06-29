import express from "express";
import auth from "../middlewares/auth";
import { DisputeControllers } from "../controllers/dispute.controllers";

const router = express.Router();

router.post("/", auth(), DisputeControllers.createDispute);
router.get("/", auth("admin"), DisputeControllers.getDisputes);
router.put("/:id/resolve", auth("admin"), DisputeControllers.resolveDispute);

export const disputeRoutes = router;
