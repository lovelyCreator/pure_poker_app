export interface CommunityPost {
    id: string;
    createdAt: string | null;
    updatedAt: string | null;
    content: string;
    authorId: string;
    likesCount: number;
    isLiked: boolean;
    deleted: boolean | null;
    author: {
      profilePicture: string | null;
      username: string;
    };
  }
  
  // export interface NewsLetterMessage {
  //   id: string;
  //   createdAt: string | null;
  //   updatedAt: string | null;
  //   message: string;
  //   communityName: string;
  //   communityAdmin: string[];
  // }
  
  export interface NewsLetterMessage {
    images: string[];
  }
  
  export interface S3Image {
    url: string;
  }
  
  export interface CommunityPosts {
    posts: CommunityPost[];
    hasNextPage: boolean;
  }
  
  // Type definition for a leaderboard entry
  export interface LeaderboardEntry {
    username: string;
    profilePicture: string;
    gains: number;
  }
  
  // Type definition for leaderboard categories
  export interface LeaderboardData {
    dailyGains: LeaderboardEntry[];
    weeklyGains: LeaderboardEntry[];
    monthlyGains: LeaderboardEntry[];
    yearlyGains: LeaderboardEntry[];
    allTimeGains: LeaderboardEntry[];
  }