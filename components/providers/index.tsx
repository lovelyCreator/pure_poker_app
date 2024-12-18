import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { LoggerProvider } from "@/utils/logging";
import React from "react";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: true,
            staleTime: 1000 * 60,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <LoggerProvider level="trace">{children}</LoggerProvider>
    </QueryClientProvider>
  );
};

export default Providers;