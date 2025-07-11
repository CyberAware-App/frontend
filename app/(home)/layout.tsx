import { BaseLayout } from "../-components";
import { Footer, NavBar, ScrollToTopButton } from "./-components";

function HomeLayout({ children }: { children: React.ReactNode }) {
	return (
		<BaseLayout className="relative bg-cyberaware-aeces-blue">
			<ScrollToTopButton />
			<NavBar />
			{children}
			<Footer />
		</BaseLayout>
	);
}

export default HomeLayout;
