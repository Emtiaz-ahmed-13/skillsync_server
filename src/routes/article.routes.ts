import express from "express";
import { ArticleControllers } from "../controllers/article.controllers";
import auth from "../middlewares/auth";
import validateRequest from "../middlewares/validateRequest";
import { ArticleValidations } from "../validations/article.validation";

const router = express.Router();

router.get("/", ArticleControllers.getAllArticles);
router.get("/:slug", ArticleControllers.getArticleBySlug);
router.post(
  "/",
  auth(),
  validateRequest(ArticleValidations.createArticle),
  ArticleControllers.createArticle,
);
router.get("/pending/list", auth("admin"), ArticleControllers.getPendingArticles);
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

export const articleRoutes = router;
