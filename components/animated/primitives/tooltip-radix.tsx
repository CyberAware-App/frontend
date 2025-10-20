"use client";

import { createCustomContext, useControllableState } from "@zayne-labs/toolkit-react";
import { AnimatePresence, type HTMLMotionProps, motion } from "motion/react";
import { Tooltip as TooltipPrimitive } from "radix-ui";
import { useMemo } from "react";

type TooltipContextType = {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
};

const [TooltipProviderLocal, useTooltipContext] = createCustomContext<TooltipContextType>({
	hookName: "useTooltipContext",
	name: "TooltipContext",
	providerName: "TooltipRoot",
});

function TooltipProvider(props: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
	// eslint-disable-next-line react-x/no-context-provider
	return <TooltipPrimitive.Provider data-slot="tooltip-provider" {...props} />;
}

function TooltipRoot(props: React.ComponentProps<typeof TooltipPrimitive.Root>) {
	const { defaultOpen, onOpenChange, open, ...restOfProps } = props;

	const [isOpen, setIsOpen] = useControllableState({
		defaultValue: defaultOpen,
		onChange: onOpenChange,
		value: open,
	});

	const contextValue = useMemo(() => ({ isOpen, setIsOpen }), [isOpen, setIsOpen]);

	return (
		<TooltipProviderLocal value={contextValue}>
			<TooltipProvider>
				<TooltipPrimitive.Root data-slot="tooltip-root" {...restOfProps} onOpenChange={setIsOpen} />
			</TooltipProvider>
		</TooltipProviderLocal>
	);
}

function TooltipTrigger(props: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
	return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipPortal(props: Omit<React.ComponentProps<typeof TooltipPrimitive.Portal>, "forceMount">) {
	const { isOpen } = useTooltipContext();

	return (
		<AnimatePresence>
			{isOpen && <TooltipPrimitive.Portal forceMount={true} data-slot="tooltip-portal" {...props} />}
		</AnimatePresence>
	);
}

function TooltipContent(
	props: HTMLMotionProps<"div">
		& Omit<React.ComponentProps<typeof TooltipPrimitive.Content>, "asChild" | "forceMount">
) {
	const {
		align,
		alignOffset,
		arrowPadding,
		avoidCollisions,
		collisionBoundary,
		collisionPadding,
		hideWhenDetached,
		onEscapeKeyDown,
		onPointerDownOutside,
		side,
		sideOffset,
		sticky,
		transition,
		...restOfProps
	} = props;

	return (
		<TooltipPrimitive.Content
			asChild={true}
			forceMount={true}
			align={align}
			alignOffset={alignOffset}
			side={side}
			sideOffset={sideOffset}
			avoidCollisions={avoidCollisions}
			collisionBoundary={collisionBoundary}
			collisionPadding={collisionPadding}
			arrowPadding={arrowPadding}
			sticky={sticky}
			hideWhenDetached={hideWhenDetached}
			onEscapeKeyDown={onEscapeKeyDown}
			onPointerDownOutside={onPointerDownOutside}
		>
			<motion.div
				key="popover-content"
				data-slot="popover-content"
				initial={{ opacity: 0, scale: 0.5 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.5 }}
				transition={transition ?? { damping: 25, stiffness: 300, type: "spring" }}
				{...restOfProps}
			/>
		</TooltipPrimitive.Content>
	);
}

function TooltipArrow(props: React.ComponentProps<typeof TooltipPrimitive.Arrow>) {
	return <TooltipPrimitive.Arrow data-slot="tooltip-arrow" {...props} />;
}

export const Root = TooltipRoot;
export const Trigger = TooltipTrigger;
export const Portal = TooltipPortal;
export const Content = TooltipContent;
export const Arrow = TooltipArrow;

// eslint-disable-next-line react-refresh/only-export-components
export { useTooltipContext };
