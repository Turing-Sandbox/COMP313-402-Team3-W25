import { Request, Response } from "express";
import { PersonalizedFeedService } from "../services/personalizedFeedService";

export class PersonalizedFeedController {
  static async getPersonalizedFeed(req: Request, res: Response) {
    console.log("Fetching Personalized Feed...");
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    try {
      const response = await PersonalizedFeedService.getPersonalizedFeed(
        userId,
        Number(page),
        Number(limit)
      );
      res.status(200).json(response);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ error: error.message || "Failed to fetch personalized feed" });
    }
  }

  static async trackContentView(req: Request, res: Response) {
    console.log("Tracking Content View...");
    const { userId, contentId } = req.params;

    try {
      const response = await PersonalizedFeedService.trackContentView(
        userId,
        contentId
      );
      res.status(200).json({ success: true });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ error: error.message || "Failed to track content view" });
    }
  }

  static async getTrendingContent(req: Request, res: Response) {
    console.log("Fetching Trending Content...");
    const { limit = 5 } = req.query;

    try {
      const response = await PersonalizedFeedService.getTrendingContent(
        Number(limit)
      );
      res.status(200).json(response);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ error: error.message || "Failed to fetch trending content" });
    }
  }

  static async updateUserInterests(req: Request, res: Response) {
    console.log("Updating User Interests...");
    const { userId } = req.params;
    const { interests } = req.body;

    try {
      if (!interests || !Array.isArray(interests)) {
        return res.status(400).json({ error: "Invalid interests provided" });
      }

      const response = await PersonalizedFeedService.updateUserInterests(
        userId,
        interests
      );
      res.status(200).json({ success: true });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ error: error.message || "Failed to update user interests" });
    }
  }
}
