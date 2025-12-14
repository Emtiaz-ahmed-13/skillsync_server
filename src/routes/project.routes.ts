import express from "express";
import { ProjectControllers } from "../controllers/project.controllers";
import auth from "../middlewares/auth";
import validateRequest from "../middlewares/validateRequest";
import {
  addMilestoneSchema,
  bulkUpdateMilestonesSchema,
  createProjectSchema,
  placeBidSchema,
  updateBidSchema,
  updateProjectSchema,
} from "../validations/project.validation";

const router = express.Router();

// GET /projects - Get all projects (public or authenticated)
router.get("/", ProjectControllers.getAllProjects);

// GET /projects/search - Search projects by title or description
router.get("/search", ProjectControllers.searchProjects);

// GET /projects/my-bids - Get freelancer's bids
router.get("/my-bids", auth("freelancer"), ProjectControllers.getFreelancerBids);

// GET /projects/:id - Get specific project
router.get("/:id", ProjectControllers.getProjectById);

// GET /projects/:id/milestones - Get all milestones for a project
router.get("/:id/milestones", ProjectControllers.getProjectMilestones);

// GET /projects/milestones - Get all milestones for the authenticated user
router.get("/milestones", auth(), ProjectControllers.getUserMilestones);

// PUT /projects/milestones/bulk - Bulk update milestones
router.put(
  "/milestones/bulk",
  auth(),
  validateRequest(bulkUpdateMilestonesSchema),
  ProjectControllers.bulkUpdateMilestones,
);

// PUT /projects/:id/approve - Approve project (ADMIN only)
router.put("/:id/approve", auth("admin"), ProjectControllers.approveProject);

// PUT /projects/:id - Update project
router.put("/:id", auth(), validateRequest(updateProjectSchema), ProjectControllers.updateProject);

// DELETE /projects/:id - Delete project
router.delete("/:id", auth(), ProjectControllers.deleteProject);

// POST /projects - Create project (ADMIN only)
router.post(
  "/",
  auth("admin"), // Simplified - using auth middleware with role check
  validateRequest(createProjectSchema),
  ProjectControllers.createProject,
);

// GET /projects/:id/dashboard - Get project dashboard
router.get("/:id/dashboard", auth(), ProjectControllers.getDashboard);

// POST /projects/:id/milestones - Add milestone to project
router.post(
  "/:id/milestones",
  auth(),
  validateRequest(addMilestoneSchema),
  ProjectControllers.addMilestone,
);

// BIDDING ROUTES

// POST /projects/:id/bids - Place a bid on a project (Freelancer only)
router.post(
  "/:id/bids",
  auth("freelancer"),
  validateRequest(placeBidSchema),
  ProjectControllers.placeBid,
);

// GET /projects/:id/bids - Get all bids for a project
router.get("/:id/bids", auth(), ProjectControllers.getProjectBids);

// PUT /projects/:id/bids/:bidId - Accept a bid and assign freelancer to project (Owner only)
router.put(
  "/:id/bids/:bidId",
  auth("client", "admin"),
  validateRequest(updateBidSchema),
  ProjectControllers.acceptBid,
);

export const projectRoutes = router;
