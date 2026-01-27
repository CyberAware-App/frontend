"use client";

import {
	dehydrate,
	HydrationBoundary as HydrationBoundaryPrimitive,
	QueryClient,
} from "@tanstack/react-query";
import { isArray, type Awaitable } from "@zayne-labs/toolkit-type-helpers";
import { getQueryClient } from "@/lib/react-query/queryClient";

type HydrationBoundaryProps = {
	children: React.ReactNode;
	onPrefetch?: (client: QueryClient) => Array<Promise<void>> | Awaitable<void>;
	queryClient?: QueryClient;
};

function HydrationBoundary(props: HydrationBoundaryProps) {
	const { children, onPrefetch, queryClient: queryClientProp } = props;

	const queryClient = queryClientProp ?? getQueryClient();

	const promiseOrPromiseArray = onPrefetch?.(queryClient);

	void (isArray(promiseOrPromiseArray) ? Promise.all(promiseOrPromiseArray) : promiseOrPromiseArray);

	const state = dehydrate(queryClient);

	return <HydrationBoundaryPrimitive state={state}>{children}</HydrationBoundaryPrimitive>;
}

export { HydrationBoundary };
