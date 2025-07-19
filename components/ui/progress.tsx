"use client";

import type { InferProps } from "@zayne-labs/toolkit-react/utils";
import { Progress as ProgressPrimitive } from "radix-ui";
import { cnMerge } from "@/lib/utils/cn";

function Progress(
	props: InferProps<typeof ProgressPrimitive.Root> & {
		classNames?: { base?: string; indicator?: string };
	}
) {
	const { className, classNames, value, ...restOfProps } = props;

	return (
		<ProgressPrimitive.Root
			data-slot="progress-root"
			className={cnMerge(
				"relative h-2 w-full overflow-hidden rounded-full bg-shadcn-primary/20",
				className,
				classNames?.base
			)}
			{...restOfProps}
		>
			<ProgressPrimitive.Indicator
				data-slot="progress-indicator"
				className={cnMerge("size-full flex-1 bg-shadcn-primary transition-all", classNames?.indicator)}
				style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
			/>
		</ProgressPrimitive.Root>
	);
}

export { Progress };
