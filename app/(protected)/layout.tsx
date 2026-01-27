import { sessionQuery } from "@/lib/react-query/queryOptions";
import { HydrationBoundary } from "../HydrationBoundary.client";

function ProtectedLayout({ children }: LayoutProps<"/">) {
	return (
		<HydrationBoundary onPrefetch={(client) => client.prefetchQuery(sessionQuery())}>
			{children}
		</HydrationBoundary>
	);
}

export default ProtectedLayout;
