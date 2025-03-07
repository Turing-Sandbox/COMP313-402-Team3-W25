import { Content } from "@/models/Content";
import { PersonalizedFeedResponse, UserPreferences } from "@/models/UserPreferences";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export const getPersonalizedFeed = async (
  userId: string,
  page: number = 1,
  limit: number = 10
): Promise<PersonalizedFeedResponse> => {
  try {
    const response = await fetch(
      `${API_URL}/content/feed/${userId}?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch personalized feed");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching personalized feed:", error);
    throw error;
  }
};

export const trackContentView = async (
  userId: string,
  contentId: string
): Promise<boolean> => {
  try {
    const response = await fetch(
      `${API_URL}/content/feed/view/${userId}/${contentId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to track content view");
    }

    return true;
  } catch (error) {
    console.error("Error tracking content view:", error);
    return false;
  }
};

export const getTrendingContent = async (
  limit: number = 5
): Promise<Content[]> => {
  try {
    const response = await fetch(
      `${API_URL}/content/feed/trending/content?limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch trending content");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching trending content:", error);
    throw error;
  }
};

export const updateUserInterests = async (
  userId: string,
  interests: string[]
): Promise<boolean> => {
  try {
    const response = await fetch(
      `${API_URL}/content/feed/interests/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ interests }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update user interests");
    }

    return true;
  } catch (error) {
    console.error("Error updating user interests:", error);
    return false;
  }
};
