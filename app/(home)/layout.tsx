import { Footer, NavBar, ScrollToTopButton } from "./-components";

function PrimaryLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex min-h-svh w-full flex-col items-center bg-cyberaware-aeces-blue">
			<ScrollToTopButton />
			<NavBar />
			{children}
			<Footer />
		</div>
	);
}

export default PrimaryLayout;
