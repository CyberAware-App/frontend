function LoadingScreen(props: { text?: string }) {
	const { text = "Verifying account..." } = props;

	return (
		<section
			className="absolute inset-0 z-1000 flex items-center justify-center bg-cyberaware-aeces-blue"
		>
			<p
				className="flex h-[160px] animate-text-gradient items-center justify-center bg-linear-to-r
					from-[hsl(0,0%,67%)] via-[hsl(0,0%,21%)] to-[hsl(0,0%,67%)] bg-[200%_auto] bg-clip-text
					px-[60px] text-[22px] font-semibold text-transparent"
			>
				{text}
			</p>
		</section>
	);
}

export { LoadingScreen };
