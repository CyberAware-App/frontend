import type { InferProps } from "@zayne-labs/toolkit-react/utils";
import { cnMerge } from "@/lib/utils/cn";

function Skeleton(props: InferProps<"div">) {
	const { className, ...restOfProps } = props;

	return (
		<div
			data-slot="skeleton"
			className={cnMerge("animate-pulse rounded-md bg-shadcn-accent", className)}
			{...restOfProps}
		/>
	);
}

export { Skeleton };
