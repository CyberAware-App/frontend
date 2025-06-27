import { cnMerge } from "@/lib/utils/cn";

function Main(props: React.ComponentPropsWithoutRef<"main">) {
	const { children, className, ...restOfProps } = props;

	return (
		<main
			className={cnMerge("flex grow flex-col px-6 pt-10 md:px-[95px] md:py-[82px]", className)}
			{...restOfProps}
		>
			{children}
		</main>
	);
}

export { Main };
