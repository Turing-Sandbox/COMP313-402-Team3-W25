import { Router } from "express";
import { PersonalizedFeedController } from "../controllers/personalizedFeedController";

const personalizedFeedRoutes = Router();

personalizedFeedRoutes.get("/:userId", PersonalizedFeedController.getPersonalizedFeed);
personalizedFeedRoutes.post("/view/:userId/:contentId", PersonalizedFeedController.trackContentView);
personalizedFeedRoutes.get("/trending/content", PersonalizedFeedController.getTrendingContent);
personalizedFeedRoutes.put("/interests/:userId", PersonalizedFeedController.updateUserInterests);

export default personalizedFeedRoutes;
