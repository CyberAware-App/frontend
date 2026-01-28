"use client";

import { sessionQuery } from "@/lib/react-query/queryOptions";
import { HydrationBoundary } from "./HydrationBoundary.client";

function RootTemplate({ children }: LayoutProps<"/">) {
	return (
		<HydrationBoundary onPrefetch={(client) => client.prefetchQuery(sessionQuery())}>
			{children}
		</HydrationBoundary>
	);
}

export default RootTemplate;
