function PrimaryLayout({ children }: { children: React.ReactNode }) {
	return <div className="flex min-h-svh w-full flex-col items-center">{children}</div>;
}

export default PrimaryLayout;
