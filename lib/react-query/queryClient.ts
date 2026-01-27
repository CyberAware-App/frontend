import { defaultShouldDehydrateQuery, QueryClient } from "@tanstack/react-query";
import { isServer } from "@zayne-labs/toolkit-core";
import { cache } from "react";

const makeQueryClient = () => {
	return new QueryClient({
		defaultOptions: {
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

			queries: {
				retry: 1,
			},
		},
	});
};

const makeQueryClientOnServer = cache(makeQueryClient);

let browserQueryClient: QueryClient | undefined;

export const getQueryClient = () => {
	if (isServer()) {
		return makeQueryClientOnServer();
	}

	browserQueryClient ??= makeQueryClient();

	return browserQueryClient;
};
