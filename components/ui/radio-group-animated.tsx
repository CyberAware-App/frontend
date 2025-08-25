"use client";

import type { InferProps } from "@zayne-labs/toolkit-react/utils";
import { AnimatePresence, type HTMLMotionProps, motion, type Transition } from "motion/react";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import { cnMerge } from "@/lib/utils/cn";
import { IconBox } from "../common/IconBox";

function RadioGroupRoot(props: InferProps<typeof RadioGroupPrimitive.Root>) {
	const { className, ...restOfProps } = props;

	return (
		<RadioGroupPrimitive.Root
			data-slot="radio-group-root"
			className={cnMerge("grid gap-2.5", className)}
			{...restOfProps}
		/>
	);
}

function RadioGroupIndicator(
	props: InferProps<typeof RadioGroupPrimitive.Indicator> & { transition?: Transition }
) {
	const { transition, className, children, ...restOfProps } = props;

	return (
		<AnimatePresence>
			<RadioGroupPrimitive.Indicator
				data-slot="radio-group-indicator"
				className={cnMerge("flex items-center justify-center", className)}
				asChild={true}
				{...restOfProps}
			>
				<motion.div
					key="radio-group-indicator-circle"
					initial={{ opacity: 0, scale: 0 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0 }}
					transition={transition ?? { type: "spring", stiffness: 200, damping: 16 }}
				>
					{children ?? <IconBox icon="lucide:circle" className="fill-current text-current" />}
				</motion.div>
			</RadioGroupPrimitive.Indicator>
		</AnimatePresence>
	);
}

function RadioGroupItem(
	props: InferProps<typeof RadioGroupPrimitive.Item>
		& HTMLMotionProps<"button"> & { transition?: Transition }
) {
	const { transition, className, children, ...restOfProps } = props;

	return (
		<RadioGroupPrimitive.Item data-slot="radio-group-item" asChild={true} {...restOfProps}>
			<motion.button
				className={cnMerge(
					`flex aspect-square size-5 items-center justify-center rounded-full border
					border-shadcn-input text-shadcn-primary ring-offset-shadcn-background focus:outline-none
					focus-visible:ring-2 focus-visible:ring-shadcn-ring focus-visible:ring-offset-2
					disabled:cursor-not-allowed disabled:opacity-50`,
					className
				)}
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
				{...restOfProps}
			>
				{children ?? <RadioGroupIndicator transition={transition} />}
			</motion.button>
		</RadioGroupPrimitive.Item>
	);
}

export const Root = RadioGroupRoot;
export const Indicator = RadioGroupIndicator;
export const Item = RadioGroupItem;
