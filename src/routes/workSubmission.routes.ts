import express from "express";
import { WorkSubmissionControllers } from "../controllers/workSubmission.controllers";
import auth from "../middlewares/auth";
import validateRequest from "../middlewares/validateRequest";
import {
  createWorkSubmissionSchema,
  updateWorkSubmissionSchema,
  updateWorkSubmissionStatusSchema,
} from "../validations/workSubmission.validation";

const router = express.Router();

router.post(
  "/",
  auth(),
  validateRequest(createWorkSubmissionSchema),
  WorkSubmissionControllers.createWorkSubmission,
);

router.get("/project/:projectId", auth(), WorkSubmissionControllers.getWorkSubmissionsByProject);

router.get("/sprint/:sprintId", auth(), WorkSubmissionControllers.getWorkSubmissionsBySprint);

router.get(
  "/freelancer/:freelancerId",
  auth(),
  WorkSubmissionControllers.getWorkSubmissionsByFreelancer,
);

router.get("/:id", auth(), WorkSubmissionControllers.getWorkSubmissionById);

router.patch(
  "/:id",
  auth(),
  validateRequest(updateWorkSubmissionSchema),
  WorkSubmissionControllers.updateWorkSubmission,
);

router.patch(
  "/:id/status",
  auth(),
  validateRequest(updateWorkSubmissionStatusSchema),
  WorkSubmissionControllers.updateWorkSubmissionStatus,
);

router.delete("/:id", auth(), WorkSubmissionControllers.deleteWorkSubmission);

export const workSubmissionRoutes = router;
