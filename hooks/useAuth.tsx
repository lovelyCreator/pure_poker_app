import NotLoggedIn from "@/components/page/not-logged-in";
import useUserDetails from "./useFetchUserFetails";
import React from "react";
import { createContext, useEffect, useState } from "react";
import type { User } from "@/types/user";
import { useSpan, SpanWrapper } from "@/utils/logging";
import { ActivityIndicator, View } from "react-native";

export const dynamic = "force-dynamic";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthContext = createContext<User | null>(null);

export default function AuthProvider({ children }: AuthProviderProps) {
  const span = useSpan("AuthProvider");
  const [loading, setLoading] = useState(true);

  const query = useUserDetails();
  
  useEffect(() => {
    if (!query.isLoading && query.data) {
      setLoading(false); // Set loading to false when data is fetched
    }
  }, [query.isLoading, query.data]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" /> {/* Customize color as needed */}
      </View>
    );
  }
  return query.data !== undefined && query.data && !query.isLoading ? (
    <SpanWrapper name="AuthContextProvider" span={span}>
      <AuthContext.Provider value={query.data}>{children}</AuthContext.Provider>
    </SpanWrapper>
  ) : (
    <NotLoggedIn />
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}