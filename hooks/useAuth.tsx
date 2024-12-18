"use client";
import NotLoggedIn from "@/components/page/not-logged-in";
import useUserDetails from "./useFetchUserFetails";
import React from "react";
import { createContext } from "react";
import type { User } from "@/types/user";
import { useSpan, SpanWrapper } from "@/utils/logging";

export const dynamic = "force-dynamic";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthContext = createContext<User>({} as User);

export default function AuthProvider({ children }: AuthProviderProps) {
  const span = useSpan("AuthProvider");

  const query = useUserDetails();

  console.log("query ==> ", query)
  
  return query.data !== undefined && query.data && !query.isLoading ? (
    <SpanWrapper name="AuthContextProvider" span={span}>
      <AuthContext.Provider value={query.data}>{children}</AuthContext.Provider>
    </SpanWrapper>
  ) : (
    <NotLoggedIn />
  );
}

export function useAuth() {
  return React.useContext(AuthContext);
}
