import { cnMerge } from "@/lib/utils/cn";

function Main(props: React.ComponentPropsWithoutRef<"main">) {
	const { children, className, ...restOfProps } = props;

	return (
		<main className={cnMerge("flex max-w-[430px] grow flex-col", className)} {...restOfProps}>
			{children}
		</main>
	);
}

export { Main };
