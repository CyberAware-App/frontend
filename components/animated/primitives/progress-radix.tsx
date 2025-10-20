/* eslint-disable react-x/no-unstable-default-props */
"use client";

import { createCustomContext } from "@zayne-labs/toolkit-react";
import { motion } from "motion/react";
import { Progress as ProgressPrimitive } from "radix-ui";
import { useMemo } from "react";

type ProgressContextType = {
	value: number;
};

const [ProgressContextProvider, useProgressContext] = createCustomContext<ProgressContextType>({
	name: "ProgressContext",
});

type ProgressProps = React.ComponentProps<typeof ProgressPrimitive.Root>;

function ProgressRoot(props: ProgressProps) {
	const { value } = props;

	const contextValue = useMemo(() => ({ value: value ?? 0 }), [value]);

	return (
		<ProgressContextProvider value={contextValue}>
			<ProgressPrimitive.Root data-slot="progress-root" {...props} />
		</ProgressContextProvider>
	);
}

const MotionProgressIndicator = motion.create(ProgressPrimitive.Indicator);

type ProgressIndicatorProps = React.ComponentProps<typeof MotionProgressIndicator>;

function ProgressIndicator({
	transition = { damping: 30, stiffness: 100, type: "spring" },
	...props
}: ProgressIndicatorProps) {
	const { value } = useProgressContext();

	return (
		<MotionProgressIndicator
			data-slot="progress-indicator"
			animate={{ x: `-${100 - (value || 0)}%` }}
			transition={transition}
			{...props}
		/>
	);
}

export const Root = ProgressRoot;
export const Indicator = ProgressIndicator;

// eslint-disable-next-line react-refresh/only-export-components
export { useProgressContext };
