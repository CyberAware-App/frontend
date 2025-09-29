"use client";

import { createCustomContext, useCallbackRef, useControllableState } from "@zayne-labs/toolkit-react";
import { composeEventHandlers, type InferProps } from "@zayne-labs/toolkit-react/utils";
import { AnimatePresence, type HTMLMotionProps, motion, type Transition } from "motion/react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { useMemo } from "react";
import { cnMerge } from "@/lib/utils/cn";
import { IconBox } from "../common/IconBox";

type ContextValue = {
	isOpen: boolean;
	onClose: () => void;
	onOpen: () => void;
	setIsOpen: (open: boolean) => void;
};

const [DialogContextProvider, useDialogContext] = createCustomContext<ContextValue>();

function DialogRoot(props: InferProps<typeof DialogPrimitive.Root>) {
	// eslint-disable-next-line ts-eslint/unbound-method
	const { defaultOpen, onOpenChange, open, ...restOfProps } = props;

	const [isOpen, setIsOpen] = useControllableState({
		defaultValue: defaultOpen,
		value: open,
		onChange: onOpenChange,
	});

	const onClose = useCallbackRef(() => setIsOpen(false));
	const onOpen = useCallbackRef(() => setIsOpen(true));

	const contextValue = useMemo(
		() => ({ isOpen, onClose, onOpen, setIsOpen }) satisfies ContextValue,
		[onClose, onOpen, isOpen, setIsOpen]
	);

	return (
		<DialogContextProvider value={contextValue}>
			<DialogPrimitive.Root
				{...restOfProps}
				data-slot="dialog-root"
				open={isOpen}
				onOpenChange={setIsOpen}
			/>
		</DialogContextProvider>
	);
}

function DialogTrigger(props: InferProps<typeof DialogPrimitive.Trigger>) {
	const { onClick, ...restOfProps } = props;
	const { onOpen } = useDialogContext();

	return (
		<DialogPrimitive.Trigger
			data-slot="dialog-trigger"
			{...restOfProps}
			onClick={composeEventHandlers(onClick, onOpen)}
		/>
	);
}

function DialogPortal(props: InferProps<typeof DialogPrimitive.Portal>) {
	return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose(props: InferProps<typeof DialogPrimitive.Close>) {
	return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay(props: InferProps<typeof DialogPrimitive.Overlay>) {
	const { className, ...restOfProps } = props;

	return (
		<DialogPrimitive.Overlay
			className={cnMerge(
				`fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0
				data-[state=open]:animate-in data-[state=open]:fade-in-0`,
				className
			)}
			{...restOfProps}
		/>
	);
}

type FlipDirection = "top" | "bottom" | "left" | "right";

type DialogContentProps = React.ComponentProps<typeof DialogPrimitive.Content>
	& HTMLMotionProps<"div"> & {
		from?: FlipDirection;
		transition?: Transition;
	};

function DialogContent(
	props: DialogContentProps & {
		withCloseBtn?: boolean;
		classNames?: { overlay?: string; base?: string };
	}
) {
	const {
		className,
		children,
		from = "top",
		transition,
		withCloseBtn = true,
		classNames,
		...restOfProps
	} = props;
	const { isOpen } = useDialogContext();

	const initialRotation = from === "top" || from === "left" ? "20deg" : "-20deg";
	const isVertical = from === "top" || from === "bottom";
	const rotateAxis = isVertical ? "rotateX" : "rotateY";

	return (
		<AnimatePresence>
			{isOpen && (
				<DialogPortal forceMount={true}>
					<DialogOverlay asChild={true} forceMount={true} className={classNames?.overlay}>
						<motion.div
							key="dialog-overlay"
							initial={{ opacity: 0, filter: "blur(4px)" }}
							animate={{ opacity: 1, filter: "blur(0px)" }}
							exit={{ opacity: 0, filter: "blur(4px)" }}
							transition={{ duration: 0.2, ease: "easeInOut" }}
						/>
					</DialogOverlay>

					<DialogPrimitive.Content
						data-slot="dialog-content"
						asChild={true}
						forceMount={true}
						{...restOfProps}
					>
						<motion.div
							key="dialog-content"
							initial={{
								opacity: 0,
								filter: "blur(4px)",
								transform: `perspective(500px) ${rotateAxis}(${initialRotation}) scale(0.8)`,
							}}
							animate={{
								opacity: 1,
								filter: "blur(0px)",
								transform: `${rotateAxis}(0deg) scale(1)`,
							}}
							exit={{
								opacity: 0,
								filter: "blur(4px)",
								transform: `perspective(500px) ${rotateAxis}(${initialRotation}) scale(0.8)`,
							}}
							transition={transition ?? { type: "spring", stiffness: 150, damping: 25 }}
							className={cnMerge(
								`fixed top-[50%] left-[50%] z-50 grid w-full max-w-lg translate-[-50%] gap-4
								rounded-lg border bg-shadcn-background p-6 shadow-lg`,
								className,
								classNames?.base
							)}
						>
							{children}

							{withCloseBtn && (
								<DialogClose
									className="absolute top-4 right-4 rounded-xs opacity-70
										ring-offset-shadcn-background transition-opacity hover:opacity-100
										focus:ring-2 focus:ring-shadcn-ring focus:ring-offset-2 focus:outline-hidden
										disabled:pointer-events-none data-[state=open]:bg-shadcn-accent
										data-[state=open]:text-shadcn-muted-foreground [&_svg]:pointer-events-none
										[&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
								>
									<IconBox icon="lucide:x" className="size-4" />
									<span className="sr-only">Close</span>
								</DialogClose>
							)}
						</motion.div>
					</DialogPrimitive.Content>
				</DialogPortal>
			)}
		</AnimatePresence>
	);
}

function DialogHeader(props: InferProps<"div">) {
	const { className, ...restOfProps } = props;

	return (
		<div
			data-slot="dialog-header"
			className={cnMerge("flex flex-col gap-2 text-center", className)}
			{...restOfProps}
		/>
	);
}

function DialogFooter(props: InferProps<"div">) {
	const { className, ...restOfProps } = props;

	return (
		<div
			data-slot="dialog-footer"
			className={cnMerge("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
			{...restOfProps}
		/>
	);
}

function DialogTitle(props: InferProps<typeof DialogPrimitive.Title>) {
	const { className, ...restOfProps } = props;

	return (
		<DialogPrimitive.Title
			data-slot="dialog-title"
			className={cnMerge("text-lg leading-none font-semibold", className)}
			{...restOfProps}
		/>
	);
}

function DialogDescription(props: InferProps<typeof DialogPrimitive.Description>) {
	const { className, ...restOfProps } = props;

	return (
		<DialogPrimitive.Description
			data-slot="dialog-description"
			className={cnMerge("text-sm text-shadcn-muted-foreground", className)}
			{...restOfProps}
		/>
	);
}

type RenderFn = (props: ContextValue) => React.ReactNode;

function DialogContext(props: { children: RenderFn }) {
	const { children } = props;

	const dialogCtx = useDialogContext();

	return children(dialogCtx);
}

export const Root = DialogRoot;

export const Context = DialogContext;

export const Close = DialogClose;

export const Content = DialogContent;

export const Description = DialogDescription;

export const Footer = DialogFooter;

export const Header = DialogHeader;

export const Overlay = DialogOverlay;

export const Portal = DialogPortal;

export const Title = DialogTitle;

export const Trigger = DialogTrigger;

// eslint-disable-next-line react-refresh/only-export-components
export { useDialogContext };
