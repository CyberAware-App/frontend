"use client";

import { ProgressProvider } from "@bprogress/next/app";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getQueryClient } from "@/lib/react-query/queryClient";
import { dashboardQuery, sessionQuery } from "@/lib/react-query/queryOptions";
import { HydrationBoundary } from "./HydrationBoundary";

type ProvidersProps = {
	children: React.ReactNode;
};

export function Providers(props: ProvidersProps) {
	const { children } = props;

	const queryClient = getQueryClient();

	return (
		<HydrationBoundary
			queryClient={queryClient}
			onPrefetch={(client) => {
				void client.prefetchQuery(sessionQuery());
				void client.prefetchQuery(dashboardQuery());
			}}
		>
			<ProgressProvider
				height="2px"
				color="hsl(27, 100%, 56%)"
				options={{ showSpinner: true }}
				shallowRouting={true}
			>
				{children}
			</ProgressProvider>

			<ReactQueryDevtools buttonPosition="bottom-left" initialIsOpen={false} />
		</HydrationBoundary>
	);
}
