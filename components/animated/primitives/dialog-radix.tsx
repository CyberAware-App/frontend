/* eslint-disable react-x/no-unstable-default-props */
"use client";

import { createCustomContext, useControllableState } from "@zayne-labs/toolkit-react";
import { AnimatePresence, type HTMLMotionProps, motion } from "motion/react";
import { Dialog as DialogPrimitive } from "radix-ui";

type DialogContextType = {
	isOpen: boolean;
	setIsOpen: DialogProps["onOpenChange"];
};

const [DialogContextProvider, useDialogContext] = createCustomContext<DialogContextType>({
	hookName: "useDialogContext",
	name: "DialogContext",
	providerName: "DialogRoot",
});

type DialogProps = React.ComponentProps<typeof DialogPrimitive.Root>;

function DialogRoot(props: DialogProps) {
	// eslint-disable-next-line ts-eslint/unbound-method
	const { defaultOpen: defaultOpenProp, onOpenChange: onOpenChangeProps, open: openProp } = props;

	const [isOpen, setIsOpen] = useControllableState({
		defaultValue: defaultOpenProp,
		onChange: onOpenChangeProps,
		value: openProp,
	});

	return (
		<DialogContextProvider value={{ isOpen, setIsOpen }}>
			<DialogPrimitive.Root data-slot="dialog" open={isOpen} onOpenChange={setIsOpen} />
		</DialogContextProvider>
	);
}

type DialogTriggerProps = React.ComponentProps<typeof DialogPrimitive.Trigger>;

function DialogTrigger(props: DialogTriggerProps) {
	return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

type DialogPortalProps = Omit<React.ComponentProps<typeof DialogPrimitive.Portal>, "forceMount">;

function DialogPortal(props: DialogPortalProps) {
	const { isOpen } = useDialogContext();

	return (
		<AnimatePresence>
			{isOpen && <DialogPrimitive.Portal data-slot="dialog-portal" forceMount={true} {...props} />}
		</AnimatePresence>
	);
}

type DialogOverlayProps = HTMLMotionProps<"div">
	& Omit<React.ComponentProps<typeof DialogPrimitive.Overlay>, "asChild" | "forceMount">;

function DialogOverlay(props: DialogOverlayProps) {
	const { transition = { duration: 0.2, ease: "easeInOut" }, ...restOfProps } = props;

	return (
		<DialogPrimitive.Overlay data-slot="dialog-overlay" asChild={true} forceMount={true}>
			<motion.div
				key="dialog-overlay"
				initial={{ filter: "blur(4px)", opacity: 0 }}
				animate={{ filter: "blur(0px)", opacity: 1 }}
				exit={{ filter: "blur(4px)", opacity: 0 }}
				transition={transition}
				{...restOfProps}
			/>
		</DialogPrimitive.Overlay>
	);
}

type DialogFlipDirection = "bottom" | "left" | "right" | "top";

type DialogContentProps = HTMLMotionProps<"div">
	& Omit<React.ComponentProps<typeof DialogPrimitive.Content>, "asChild" | "forceMount"> & {
		from?: DialogFlipDirection;
	};

function DialogContent(props: DialogContentProps) {
	const {
		from = "top",
		onCloseAutoFocus,
		onEscapeKeyDown,
		onInteractOutside,
		onOpenAutoFocus,
		onPointerDownOutside,
		transition = { damping: 25, stiffness: 150, type: "spring" },
		...restOfProps
	} = props;

	const initialRotation = from === "bottom" || from === "left" ? "20deg" : "-20deg";
	const isVertical = from === "top" || from === "bottom";
	const rotateAxis = isVertical ? "rotateX" : "rotateY";

	return (
		<DialogPrimitive.Content
			asChild={true}
			forceMount={true}
			onOpenAutoFocus={onOpenAutoFocus}
			onCloseAutoFocus={onCloseAutoFocus}
			onEscapeKeyDown={onEscapeKeyDown}
			onPointerDownOutside={onPointerDownOutside}
			onInteractOutside={onInteractOutside}
		>
			<motion.div
				key="dialog-content"
				data-slot="dialog-content"
				initial={{
					filter: "blur(4px)",
					opacity: 0,
					transform: `perspective(500px) ${rotateAxis}(${initialRotation}) scale(0.8)`,
				}}
				animate={{
					filter: "blur(0px)",
					opacity: 1,
					transform: `perspective(500px) ${rotateAxis}(0deg) scale(1)`,
				}}
				exit={{
					filter: "blur(4px)",
					opacity: 0,
					transform: `perspective(500px) ${rotateAxis}(${initialRotation}) scale(0.8)`,
				}}
				transition={transition}
				{...restOfProps}
			/>
		</DialogPrimitive.Content>
	);
}

type DialogCloseProps = React.ComponentProps<typeof DialogPrimitive.Close>;

function DialogClose(props: DialogCloseProps) {
	return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

type DialogHeaderProps = React.ComponentProps<"div">;

function DialogHeader(props: DialogHeaderProps) {
	return <div data-slot="dialog-header" {...props} />;
}

type DialogFooterProps = React.ComponentProps<"div">;

function DialogFooter(props: DialogFooterProps) {
	return <div data-slot="dialog-footer" {...props} />;
}

type DialogTitleProps = React.ComponentProps<typeof DialogPrimitive.Title>;

function DialogTitle(props: DialogTitleProps) {
	return <DialogPrimitive.Title data-slot="dialog-title" {...props} />;
}

type DialogDescriptionProps = React.ComponentProps<typeof DialogPrimitive.Description>;

function DialogDescription(props: DialogDescriptionProps) {
	return <DialogPrimitive.Description data-slot="dialog-description" {...props} />;
}

export const Root = DialogRoot;
export const Portal = DialogPortal;
export const Overlay = DialogOverlay;
export const Close = DialogClose;
export const Trigger = DialogTrigger;
export const Content = DialogContent;
export const Header = DialogHeader;
export const Footer = DialogFooter;
export const Title = DialogTitle;
export const Description = DialogDescription;

// eslint-disable-next-line react-refresh/only-export-components
export { useDialogContext };
