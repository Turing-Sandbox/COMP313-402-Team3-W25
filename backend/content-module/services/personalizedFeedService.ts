import { db } from "../../shared/firebaseConfig";
import { collection, getDocs, getDoc, doc, query, orderBy, limit, where, updateDoc } from "firebase/firestore";
import { Content } from "../models/contentModel";

export interface UserPreferences {
  interests: string[];
  likedContent: string[];
  viewedContent: string[];
  bookmarkedContent: string[];
  following: string[];
}

interface ContentScore {
  contentId: string;
  score: number;
  content: Content;
}

export class PersonalizedFeedService {
  static async getPersonalizedFeed(
    userId: string,
    page: number = 1,
    itemsPerPage: number = 10
  ) {
    try {
      const userPreferences = await this.getUserPreferences(userId);
      const allContent = await this.getAllContent();
      const scoredContent = await this.scoreContent(allContent, userPreferences);
      
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedContent = scoredContent.slice(startIndex, endIndex);
      
      return {
        content: paginatedContent.map(item => item.content),
        totalItems: scoredContent.length,
        currentPage: page,
        totalPages: Math.ceil(scoredContent.length / itemsPerPage)
      };
    } catch (error) {
      console.error("Error fetching personalized feed:", error);
      throw new Error(error.message || "Failed to fetch personalized feed");
    }
  }
  
  private static async getUserPreferences(userId: string): Promise<UserPreferences> {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      
      if (!userDoc.exists()) {
        throw new Error("User not found");
      }
      
      const userData = userDoc.data();
      
      return {
        interests: userData.interests || [],
        likedContent: userData.likedContent || [],
        viewedContent: userData.viewedContent || [],
        bookmarkedContent: userData.bookmarkedContent || [],
        following: userData.following || []
      };
    } catch (error) {
      console.error("Error fetching user preferences:", error);
      throw new Error(error.message || "Failed to fetch user preferences");
    }
  }
  
  private static async getAllContent(): Promise<Content[]> {
    try {
      const contentQuery = query(
        collection(db, "contents"),
        orderBy("dateCreated", "desc")
      );
      
      const contentSnapshot = await getDocs(contentQuery);
      const content = contentSnapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      } as Content));
      
      return content;
    } catch (error) {
      console.error("Error fetching content:", error);
      throw new Error(error.message || "Failed to fetch content");
    }
  }
  
  private static async scoreContent(
    content: Content[],
    userPreferences: UserPreferences
  ): Promise<ContentScore[]> {
    const scoredContent: ContentScore[] = [];
    
    for (const item of content) {
      let score = 0;
      score += 1;
    
      if (userPreferences.following.includes(item.creatorUID)) {
        score += 3;
      }
      
      if (userPreferences.likedContent.includes(item.uid)) {
        score += 2;
      }
      
      if (userPreferences.bookmarkedContent.includes(item.uid)) {
        score += 2.5;
      }
      
      if (userPreferences.viewedContent.includes(item.uid)) {
        score -= 1;
      }
      
      const createdDate = item.dateCreated instanceof Date 
        ? item.dateCreated 
        : new Date(item.dateCreated);
      const daysSinceCreation = (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceCreation < 7) {
        score += 1.5;
      }
      
      if (item.likes && item.likes > 10) {
        score += 1;
      }
      
      scoredContent.push({
        contentId: item.uid,
        score,
        content: item
      });
    }
    
    return scoredContent.sort((a, b) => b.score - a.score);
  }
  
  static async trackContentView(userId: string, contentId: string) {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        throw new Error("User not found");
      }
      
      const userData = userDoc.data();
      const viewedContent = userData.viewedContent || [];
      
      if (!viewedContent.includes(contentId)) {
        viewedContent.push(contentId);
        
        await updateDoc(userRef, {
          viewedContent
        });
      }
      
      return true;
    } catch (error) {
      console.error("Error tracking content view:", error);
      throw new Error(error.message || "Failed to track content view");
    }
  }
  
  static async getTrendingContent(limitCount: number = 5) {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const contentQuery = query(
        collection(db, "contents"),
        where("dateCreated", ">=", sevenDaysAgo),
        orderBy("dateCreated", "desc"),
        orderBy("likes", "desc"),
        limit(limitCount)
      );
      
      const contentSnapshot = await getDocs(contentQuery);
      const content = contentSnapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      } as Content));
      
      return content;
    } catch (error) {
      console.error("Error fetching trending content:", error);
      throw new Error(error.message || "Failed to fetch trending content");
    }
  }
  
  static async updateUserInterests(userId: string, interests: string[]) {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        interests
      });
      
      return true;
    } catch (error) {
      console.error("Error updating user interests:", error);
      throw new Error(error.message || "Failed to update user interests");
    }
  }
}
