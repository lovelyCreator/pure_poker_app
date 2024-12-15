export interface User {
    first_name: string | null;
    last_name: string | null;
    profilePicture: string | null;
    bestHand: string | null;
    chips: number;
    email: string;
    id: string;
    username: string;
    clearVerificationLink: string;
    clearApproval: string;
    referralCode: string;
    massPayToken: string | null;
    massPayActivationUrl: string | null;
    dailyGains: number;
    weeklyGains: number;
    monthlyGains: number;
    yearlyGains: number;
    allTimeGains: number;
  }
  