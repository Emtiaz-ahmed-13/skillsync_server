import express from "express";
import { ArticleControllers } from "../controllers/article.controllers";
import auth from "../middlewares/auth";
import validateRequest from "../middlewares/validateRequest";
import { ArticleValidations } from "../validations/article.validation";

const router = express.Router();

// Public routes
router.get("/", ArticleControllers.getAllArticles);
router.get("/:slug", ArticleControllers.getArticleBySlug);

// Authenticated routes (all users can create articles)
router.post(
  "/",
  auth(),
  validateRequest(ArticleValidations.createArticle),
  ArticleControllers.createArticle,
);

router.get("/pending/list", auth("admin"), ArticleControllers.getPendingArticles);

// User routes (only author can update/delete their own articles)
router.patch(
  "/:id",
  auth(),
  validateRequest(ArticleValidations.updateArticle),
  ArticleControllers.updateArticle,
);

router.delete("/:id", auth(), ArticleControllers.deleteArticle);

// Admin routes (only admin can approve/reject articles)
router.patch(
  "/:id/approve",
  auth("admin"),
  validateRequest(ArticleValidations.approveArticle),
  ArticleControllers.approveArticle,
);

export const articleRoutes = router;
