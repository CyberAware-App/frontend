"use client";

import { toArray } from "@zayne-labs/toolkit-core";
import type { InferProps } from "@zayne-labs/toolkit-react/utils";
import { motion, type Transition } from "motion/react";
import * as TooltipAnimated from "@/components/ui/tooltip-animated";
import { cnMerge } from "@/lib/utils/cn";

type AvatarProps = InferProps<typeof TooltipAnimated.Root> & {
	children: React.ReactNode;
	zIndex: number;
	transition: Transition;
	translate: string | number;
};

function AvatarContainer({ children, zIndex, transition, translate, ...props }: AvatarProps) {
	return (
		<TooltipAnimated.Root {...props}>
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
							initial: { y: 0 },
							hover: { y: translate },
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
	transition?: Transition;
	invertOverlap?: boolean;
	translate?: string | number;
	tooltipProps?: Omit<InferProps<typeof TooltipAnimated.Root>, "children">;
};

function AvatarGroupRoot(props: AvatarGroupProps) {
	const {
		ref,
		children,
		className,
		transition,
		invertOverlap = false,
		translate = "-30%",
		tooltipProps,
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
						// eslint-disable-next-line react/no-array-index-key
						key={index}
						zIndex={invertOverlap ? childrenArray.length - index : index}
						transition={transition ?? { type: "spring", stiffness: 300, damping: 17 }}
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
