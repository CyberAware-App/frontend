import type { InferProps } from "@zayne-labs/toolkit-react/utils";
import { cnMerge } from "@/lib/utils/cn";
import * as ProgressPrimitive from "../primitives/progress-radix";

type ProgressRootProps = InferProps<typeof ProgressPrimitive.Root> & {
	classNames?: {
		base?: string;
		indicator?: string;
	};
};

function ProgressRoot(props: ProgressRootProps) {
	const { className, classNames, ...restOfProps } = props;

	return (
		<ProgressPrimitive.Root
			className={cnMerge(
				"relative h-2 w-full overflow-hidden rounded-full bg-neutral-900/20",
				className,
				classNames?.base
			)}
			{...restOfProps}
		>
			<ProgressPrimitive.Indicator
				className={cnMerge("size-full flex-1 rounded-full bg-neutral-900", classNames?.indicator)}
			/>
		</ProgressPrimitive.Root>
	);
}

export const Root = ProgressRoot;
