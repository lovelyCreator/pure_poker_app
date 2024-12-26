import NotLoggedIn from "@/app/notLoggedIn";
import useUserDetails from "./useFetchUserFetails";
import React from "react";
import { createContext, useCallback } from "react";
import type { User } from "@/types/user";
import { useSpan, SpanWrapper } from "@/utils/logging";
import SignIn from "@/app/index";

export const dynamic = "force-dynamic";

interface AuthProviderProps {
  children: React.ReactNode;
}

interface AuthContextType {
  username: string;
  profilePicture: string;
  id(groupIds: any, id: any): { data: any; };
  massPayToken: any;
  clearApproval: string;
  user: User | undefined;
  refetchUser: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: AuthProviderProps) {
  const span = useSpan("AuthProvider");

  const query = useUserDetails();

  const refetchUser = useCallback(() => {
    query.refetch();
  }, [query])


  console.log("Query: ", query.data, query.isLoading, span)

  return (
    <SpanWrapper name="AuthContextProvider" span={span}>
      <AuthContext.Provider value={{ user: query.data, refetchUser }}>{children}</AuthContext.Provider>
    </SpanWrapper>
  )
  // return query.data !== undefined && query.data && !query.isLoading ? (
  //   <AuthContext.Provider value={query.data}>
  //     {children}
  //   </AuthContext.Provider>
  // ) : (
  //   <NotLoggedIn />
  // );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
