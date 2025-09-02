import { defaultShouldDehydrateQuery, QueryClient } from "@tanstack/react-query";
import { cache } from "react";

const makeQueryClient = () => {
	return new QueryClient({
		defaultOptions: {
			queries: {
				retry: 1,
				refetchOnWindowFocus: false,
				refetchOnMount: false,
				refetchOnReconnect: false,
				// With SSR, we usually want to set some default staleTime
				// above 0 to avoid refetching immediately on the client
				staleTime: 2 * 60 * 1000,
			},

			dehydrate: {
				// include pending queries in dehydration
				shouldDehydrateQuery: (query) =>
					defaultShouldDehydrateQuery(query) || query.state.status === "pending",
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

export const getQueryClient = cache(() => makeQueryClient());
