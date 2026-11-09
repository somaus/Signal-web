import { QueryClient } from "@tanstack/react-query";

// 웹(Signal-web/src/shared/config/queryClient.ts)과 같은 기본값.
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}
