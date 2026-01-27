import { sessionQuery } from "@/lib/react-query/queryOptions";
import { BaseLayout } from "../-components";
import { HydrationBoundary } from "../HydrationBoundary.client";
import { Footer, ScrollToTopButton } from "./-components";

function HomeLayout({ children }: { children: React.ReactNode }) {
	return (
		<HydrationBoundary onPrefetch={(client) => client.prefetchQuery(sessionQuery())}>
			<BaseLayout className="relative bg-cyberaware-aeces-blue">
				<ScrollToTopButton />
				{children}
				<Footer />
			</BaseLayout>
		</HydrationBoundary>
	);
}

export default HomeLayout;
