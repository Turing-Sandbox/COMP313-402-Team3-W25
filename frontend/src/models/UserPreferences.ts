export interface UserInterest {
  id: string;
  name: string;
  selected: boolean;
}

export interface UserPreferences {
  interests: string[];
  viewedContent: string[];
}

export interface ContentScore {
  contentId: string;
  score: number;
}

export interface PersonalizedFeedResponse {
  content: any[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
}
