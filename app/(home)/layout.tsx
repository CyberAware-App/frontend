import { BaseLayout } from "../-components";
import { Footer, ScrollToTopButton } from "./-components";

function HomeLayout({ children }: { children: React.ReactNode }) {
	return (
		<BaseLayout className="relative bg-cyberaware-aeces-blue">
			<ScrollToTopButton />
			{children}
			<Footer />
		</BaseLayout>
	);
}

export default HomeLayout;
