"use client";

import { ProgressProvider } from "@bprogress/next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { cache } from "react";

const makeQueryClient = () => {
	return new QueryClient({
		defaultOptions: {
			queries: {
				// With SSR, we usually want to set some default staleTime
				// above 0 to avoid refetching immediately on the client
				staleTime: 1 * 60 * 1000,
			},
		},
	});
};

const getQueryClient = cache(() => makeQueryClient());

type ProvidersProps = {
	children: React.ReactNode;
};

function Providers(props: ProvidersProps) {
	const { children } = props;

	const queryClient = getQueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			<ProgressProvider
				height="2px"
				color="hsl(27, 100%, 56%)"
				options={{ showSpinner: true }}
				shallowRouting={true}
			>
				{children}
			</ProgressProvider>

			<ReactQueryDevtools buttonPosition="bottom-left" initialIsOpen={false} />
		</QueryClientProvider>
	);
}

export { Providers };
