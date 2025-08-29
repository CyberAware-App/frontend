import {
	dehydrate,
	HydrationBoundary as HydrationBoundaryPrimitive,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
import type { Awaitable } from "@zayne-labs/toolkit-type-helpers";
import { getQueryClient } from "@/lib/react-query/queryClient";

type HydrationBoundaryProps = {
	children: React.ReactNode;
	queryClient?: QueryClient;
	onPrefetch?: (queryClient: QueryClient) => Awaitable<void>;
};

function HydrationBoundary(props: HydrationBoundaryProps) {
	const { children, onPrefetch, queryClient: queryClientProp } = props;

	const queryClient = queryClientProp ?? getQueryClient();

	void onPrefetch?.(queryClient);

	const state = dehydrate(queryClient);

	return (
		<QueryClientProvider client={queryClient}>
			<HydrationBoundaryPrimitive state={state}>{children}</HydrationBoundaryPrimitive>
		</QueryClientProvider>
	);
}

export { HydrationBoundary };
