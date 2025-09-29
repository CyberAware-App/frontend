"use client";

import { toArray } from "@zayne-labs/toolkit-core";
import type { InferProps } from "@zayne-labs/toolkit-react/utils";
import { motion, type Transition } from "motion/react";
import * as TooltipAnimated from "@/components/ui/tooltip-animated";
import { cnMerge } from "@/lib/utils/cn";

type AvatarProps = InferProps<typeof TooltipAnimated.Root> & {
	children: React.ReactNode;
	transition: Transition;
	translate: number | string;
	zIndex: number;
};

function AvatarContainer(props: AvatarProps) {
	const { children, transition, translate, zIndex, ...restOfProps } = props;

	return (
		<TooltipAnimated.Root {...restOfProps}>
			<TooltipAnimated.Trigger>
				<motion.div
					data-slot="avatar-container"
					initial="initial"
					whileHover="hover"
					whileTap="hover"
					className="relative"
					style={{ zIndex }}
				>
					<motion.div
						variants={{
							hover: { y: translate },
							initial: { y: 0 },
						}}
						transition={transition}
					>
						{children}
					</motion.div>
				</motion.div>
			</TooltipAnimated.Trigger>
		</TooltipAnimated.Root>
	);
}

function AvatarGroupTooltip(props: InferProps<typeof TooltipAnimated.Content>) {
	return <TooltipAnimated.Content {...props} />;
}

type AvatarGroupProps = Omit<React.ComponentProps<"div">, "translate"> & {
	children: React.ReactNode;
	invertOverlap?: boolean;
	tooltipProps?: Omit<InferProps<typeof TooltipAnimated.Root>, "children">;
	transition?: Transition;
	translate?: number | string;
};

function AvatarGroupRoot(props: AvatarGroupProps) {
	const {
		children,
		className,
		invertOverlap = false,
		ref,
		tooltipProps,
		transition,
		translate = "-30%",
		...restOfProps
	} = props;

	const childrenArray = toArray(children);

	return (
		<TooltipAnimated.ContextProvider openDelay={0} closeDelay={0}>
			<div
				ref={ref}
				data-slot="avatar-group"
				className={cnMerge("flex h-8 flex-row items-center -space-x-2", className)}
				{...restOfProps}
			>
				{childrenArray.map((child, index) => (
					<AvatarContainer
						// eslint-disable-next-line react-x/no-array-index-key
						key={index}
						zIndex={invertOverlap ? childrenArray.length - index : index}
						transition={transition ?? { damping: 17, stiffness: 300, type: "spring" }}
						translate={translate}
						{...(tooltipProps ?? { side: "top", sideOffset: 24 })}
					>
						{child}
					</AvatarContainer>
				))}
			</div>
		</TooltipAnimated.ContextProvider>
	);
}

export const Root = AvatarGroupRoot;

export const Tooltip = AvatarGroupTooltip;
