import type { InferProps } from "@zayne-labs/toolkit-react/utils";
import { cnMerge } from "@/lib/utils/cn";

function BaseLayout(props: InferProps<"div">) {
	const { children, className, ...restOfProps } = props;

	return (
		<div className={cnMerge("flex min-h-svh w-full flex-col items-center", className)} {...restOfProps}>
			{children}
		</div>
	);
}

export { BaseLayout };
