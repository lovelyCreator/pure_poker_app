export interface Group {
    groupName: string;
    messages: GroupMessage[];
    usersConnected: string[];
    membersList: string[];
    groupId: string;
    description: string;
    groupPicture: string;
  }
  
  export interface GroupMessage {
    isNotification: boolean;
    userId: string;
    username: string;
    message: string;
    timestamp: string;
    isShareGame: boolean;
    messageId: string;
    gameId?: string;
    isActive?: boolean;
    isRequest?: boolean;
    requestId: string;
    status?: string;
    groupId: string;
    profilePicture: string;
  }
  
  export interface GroupDetails {
    owner: {
      userId: string;
      username: string;
      profilePicture: string;
    };
    admins: {
      userId: string;
      username: string;
      profilePicture: string;
    }[];
    members: {
      userId: string;
      username: string;
      profilePicture: string;
    }[];
    pendingRequests: GroupMessage[];
    totalMembersCount: number;
    description: string;
    privacy: string;
    creationTimeStamp: string;
    groupPicture: string;
  }
  
  export interface GroupWebSocketResponse {
    action: string;
    messages: GroupMessage[];
    groupId: string;
    statusCode: number;
    info: string;
  }
  export interface GroupWebSocketMessage {
    action: string;
    groupId: string;
    groupAction: string;
    message?: string;
    timestamp?: string;
    messageId?: string;
    newDescription?: string;
    privacy?: string;
    targetUserId?: string;
    actionPerformed?: string;
    userId?: string;
    requestId?: string;
    decision?: string;
    profilePicture?: string;
    groupPicture?: string;
  }
  
  // Type definition for available groups
  export interface AvailableGroup {
    groupId: string;
    groupName: string;
    MembersCount: number;
    privacy: "public" | "private";
    groupPicture: string;
  }
  
  export const groupPictureToLink: Record<string, string> = {
    "chip-icon" : "/assets/groups/chip-icon.svg",
    "chip-2-icon" : "/assets/groups/chip-2-icon.svg",
    "pure-icon": "/assets/groups/pure-icon.svg",
    "empire-state-building-icon": "/assets/groups/empire-state-building-icon.png",
    "statue-of-liberty-icon": "/assets/groups/statue-of-liberty-icon.png",
    "nyc-icon": "/assets/groups/nyc-icon.png",
    "california-icon": "/assets/groups/california-icon.png",
    "texas-icon": "/assets/groups/texas-icon.png",
    "alabama-icon": "/assets/groups/alabama-icon.png",
    "connecticut-icon": "/assets/groups/connecticut-icon.png",
    "ohio-icon": "/assets/groups/ohio-icon.png",
    "stanford-logo": "https://ussq-img-live.s3.amazonaws.com/uploads%2F1bb53c69-d0ee-4203-84ab-a8367a59db2a_file.png",
    // "mit-logo": "https://ussq-img-live.s3.amazonaws.com/uploads%2F1e2e247a-8f49-4552-b233-3cadfb0633e3_file.png",
    "harvard-logo": "https://ussq-img-live.s3.amazonaws.com/uploads%2F0172a8d4-a050-41db-9740-6ffd7c17a21e_file.png",
    "upenn-logo": "https://ussq-img-live.s3.amazonaws.com/uploads%2Fec209804-c182-4e86-9a98-fbdbce60c4a5_file.png",
    // "princeton-logo": "https://w7.pngwing.com/pngs/160/729/png-transparent-princeton-university-princeton-tigers-men-s-basketball-princeton-tigers-football-cornell-university-princeton-tigers-men-s-lacrosse-p-logo-miscellaneous-angle-text.png",
    "columbia-logo": "/assets/groups/columbia-logo.svg",
    "cornell-logo": "https://ussq-img-live.s3.amazonaws.com/uploads%2F601375b8-5254-4a5f-adf2-8340025e02da_file.png",
    "yale-logo": "https://ussq-img-live.s3.amazonaws.com/uploads%2F63a37246-0f04-49ec-a722-56cdc7c0c7f7_file.png",
    // "dartmouth-logo": "https://ussq-img-live.s3.amazonaws.com/uploads%2F54973097-98b6-416e-9ffa-137c1a652a9c_file.png",
    "tufts-logo": "https://ussq-img-live.s3.amazonaws.com/uploads%2F07fba3ed-8121-46dc-9d94-da464b134330_file.png",
    // "uva-logo": "https://ussq-img-live.s3.amazonaws.com/uploads%2Fbad45008-d347-4910-946a-b483e6fee204_file.png",
    // "trinity-logo": "https://ussq-img-live.s3.amazonaws.com/uploads%2F86eb097b-2881-4e85-8985-a69ec55e697e_file.png",
    "drexel-logo": "https://ussq-img-live.s3.amazonaws.com/uploads%2F17211c6f-7916-497c-900f-235b148aa6ee_file.png",
  }