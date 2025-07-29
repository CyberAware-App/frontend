"use client";

import type { InferProps } from "@zayne-labs/toolkit-react/utils";
import { motion, type Transition } from "motion/react";
import { Progress as ProgressPrimitive } from "radix-ui";
import { cnMerge } from "@/lib/utils/cn";

const MotionProgressIndicator = motion.create(ProgressPrimitive.Indicator);

function Progress(
	props: InferProps<typeof ProgressPrimitive.Root> & {
		classNames?: { base?: string; indicator?: string };
		transition?: Transition;
	}
) {
	const { className, classNames, value, transition, ...restOfProps } = props;

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
			<MotionProgressIndicator
				data-slot="progress-indicator"
				className={cnMerge("size-full flex-1 bg-shadcn-primary", classNames?.indicator)}
				animate={{ x: `-${100 - (value ?? 0)}%` }}
				transition={transition ?? { type: "spring", stiffness: 100, damping: 30 }}
			/>
		</ProgressPrimitive.Root>
	);
}

export { Progress };
