function AuthLoader(props: { text?: string }) {
	const { text = "Verifying account..." } = props;

	return (
		<div className="flex grow flex-col items-center justify-center">
			<div className="flex h-[160px] items-center justify-center px-[60px]">
				<p
					className="inline-flex animate-text-gradient bg-linear-to-r from-[hsl(0,0%,67%)]
						via-[hsl(0,0%,21%)] to-[hsl(0,0%,67%)] bg-[200%_auto] bg-clip-text text-[22px]
						font-semibold text-transparent"
				>
					{text}
				</p>
			</div>
		</div>
	);
}

export { AuthLoader };
