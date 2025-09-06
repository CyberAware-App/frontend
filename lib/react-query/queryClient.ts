import { defaultShouldDehydrateQuery, QueryClient } from "@tanstack/react-query";
import { isServer } from "@zayne-labs/toolkit-core";

const makeQueryClient = () => {
	return new QueryClient({
		defaultOptions: {
			queries: {
				retry: 1,
				// refetchOnWindowFocus: false,
				// refetchOnMount: false,
				// refetchOnReconnect: false,
				// With SSR, we usually want to set some default staleTime
				// above 0 to avoid refetching immediately on the client
				staleTime: 2 * 60 * 1000,
			},

			dehydrate: {
				// include pending queries in dehydration
				shouldDehydrateQuery: (query) => {
					return defaultShouldDehydrateQuery(query) || query.state.status === "pending";
				},
				shouldRedactErrors: (_error) => {
					// We should not catch Next.js server errors
					// as that's how Next.js detects dynamic pages
					// so we cannot redact them.
					// Next.js also automatically redacts errors for us
					// with better digests.
					return false;
				},
			},
		},
	});
};

// Use a more robust caching strategy for production
let browserQueryClient: QueryClient | undefined;

export const getQueryClient = () => {
	if (isServer()) {
		// Server: always make a new query client
		return makeQueryClient();
	}
	// Browser: make a new query client if we don't already have one
	// This is very important, so we don't re-make a new client if React
	// suspends during the initial render. This may not be needed if we
	// have a suspense boundary BELOW the creation of the query client
	browserQueryClient ??= makeQueryClient();
	return browserQueryClient;
};
