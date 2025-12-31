import express from "express";
import { ArticleControllers } from "../controllers/article.controllers";
import auth from "../middlewares/auth";
import { uploadSingle } from "../middlewares/upload.middleware";
import validateRequest from "../middlewares/validateRequest";
import { ArticleValidations } from "../validations/article.validation";

const router = express.Router();

// Specific routes first (before dynamic :slug route)
router.get("/getAllArticles", ArticleControllers.getAllArticles);
router.get("/pending/list", auth("admin"), ArticleControllers.getPendingArticles);
router.post(
  "/create-article",
  auth("client", "freelancer"),
  uploadSingle,
  validateRequest(ArticleValidations.createArticle),
  ArticleControllers.createArticle,
);

// Dynamic routes last
router.get("/:slug", ArticleControllers.getArticleBySlug);
router.patch(
  "/:id",
  auth(),
  validateRequest(ArticleValidations.updateArticle),
  ArticleControllers.updateArticle,
);
router.delete("/:id", auth(), ArticleControllers.deleteArticle);
router.patch(
  "/:id/approve",
  auth("admin"),
  validateRequest(ArticleValidations.approveArticle),
  ArticleControllers.approveArticle,
);
router.patch(
  "/:id/reject",
  auth("admin"),
  validateRequest(ArticleValidations.rejectArticle),
  ArticleControllers.rejectArticle,
);

export const articleRoutes = router;
