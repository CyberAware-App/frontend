"use client";

import { toArray } from "@zayne-labs/toolkit-core";
import { motion, type HTMLMotionProps, type Transition } from "motion/react";
import * as TooltipPrimitive from "./tooltip";

type AvatarProps = Omit<HTMLMotionProps<"div">, "translate">
	& Omit<React.ComponentProps<typeof TooltipPrimitive.Root>, "children"> & {
		children: React.ReactNode;
		translate?: number | string;
		zIndex: number;
	};

function AvatarContainer(props: AvatarProps) {
	const { align, alignOffset, side, sideOffset, translate, zIndex, ...restOfProps } = props;

	return (
		<TooltipPrimitive.Root side={side} sideOffset={sideOffset} align={align} alignOffset={alignOffset}>
			<TooltipPrimitive.Trigger asChild={true}>
				<motion.div
					data-slot="avatar-container"
					initial="initial"
					whileHover="hover"
					whileTap="hover"
					style={{ position: "relative", zIndex }}
				>
					<motion.div
						variants={{
							hover: { y: translate },
							initial: { y: 0 },
						}}
						{...restOfProps}
					/>
				</motion.div>
			</TooltipPrimitive.Trigger>
		</TooltipPrimitive.Root>
	);
}

type AvatarGroupProps = Omit<React.ComponentProps<"div">, "translate">
	& Omit<React.ComponentProps<typeof TooltipPrimitive.Provider>, "children">
	& Omit<React.ComponentProps<typeof TooltipPrimitive.Root>, "children"> & {
		children: React.ReactNode;
		invertOverlap?: boolean;
		tooltipTransition?: Transition;
		transition?: Transition;
		translate?: number | string;
	};

function AvatarGroupRoot(props: AvatarGroupProps) {
	const {
		align = "center",
		alignOffset = 0,
		children,
		closeDelay = 0,
		id,
		invertOverlap = false,
		openDelay = 0,
		ref,
		side = "top",
		sideOffset = 15,
		style,
		tooltipTransition,
		transition,
		translate = "-30%",
		...restOfProps
	} = props;

	const childrenArray = toArray(children);

	return (
		<TooltipPrimitive.Provider
			id={id}
			openDelay={openDelay}
			closeDelay={closeDelay}
			transition={tooltipTransition ?? { damping: 35, stiffness: 300, type: "spring" }}
		>
			<div
				ref={ref}
				data-slot="avatar-group"
				style={{
					alignItems: "center",
					display: "flex",
					...style,
				}}
				{...restOfProps}
			>
				{childrenArray.map((child, index) => (
					<AvatarContainer
						// eslint-disable-next-line react-x/no-array-index-key
						key={index}
						zIndex={invertOverlap ? childrenArray.length - index : index}
						transition={transition ?? { damping: 17, stiffness: 300, type: "spring" }}
						translate={translate}
						side={side}
						sideOffset={sideOffset}
						align={align}
						alignOffset={alignOffset}
					>
						{child}
					</AvatarContainer>
				))}
			</div>
		</TooltipPrimitive.Provider>
	);
}

function AvatarGroupTooltip(props: React.ComponentProps<typeof TooltipPrimitive.Content>) {
	return <TooltipPrimitive.Content {...props} />;
}

function AvatarGroupTooltipArrow(props: React.ComponentProps<typeof TooltipPrimitive.Arrow>) {
	return <TooltipPrimitive.Arrow {...props} />;
}

export const Root = AvatarGroupRoot;
export const Tooltip = AvatarGroupTooltip;
export const TooltipArrow = AvatarGroupTooltipArrow;
