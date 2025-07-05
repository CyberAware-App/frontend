import type { InferProps } from "@zayne-labs/toolkit-react/utils";
import { cnMerge } from "@/lib/utils/cn";

function Main(props: InferProps<"main">) {
	const { children, className, ...restOfProps } = props;

	return (
		<main className={cnMerge("flex w-full max-w-[430px] grow flex-col", className)} {...restOfProps}>
			{children}
		</main>
	);
}

export { Main };
