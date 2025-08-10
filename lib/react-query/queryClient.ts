import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

const makeQueryClient = () => {
	return new QueryClient({
		defaultOptions: {
			queries: {
				retry: 1,
				// With SSR, we usually want to set some default staleTime
				// above 0 to avoid refetching immediately on the client
				staleTime: 1 * 60 * 1000,
			},
		},
	});
};

export const getQueryClient = cache(() => makeQueryClient());
