import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import type { AppProps } from "next/app";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css";
import { updateCoordinates } from "@/api/order";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
      staleTime: 2000,
      retry: 0,
    },
  },
});
const persister = createSyncStoragePersister({
  storage: typeof window !== "undefined" && window.localStorage,
});
export default function App({ Component, pageProps }: AppProps) {
  queryClient.setMutationDefaults(["orders"], {
    mutationFn: async ({ orderId, coordinates }) => {
      await queryClient.cancelQueries({ queryKey: ["orders"] });
      return updateCoordinates({orderId, coordinates});
    },
  });
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
      onSuccess={() => {
        // resume mutations after initial restore from localStorage was successful
        queryClient.resumePausedMutations().then(() => {
          queryClient.invalidateQueries();
        });
      }}
    >
      <Component {...pageProps} />
    </PersistQueryClientProvider>
  );
}
