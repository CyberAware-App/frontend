"use client";

import { createCustomContext, useCallbackRef, useToggle } from "@zayne-labs/toolkit-react";
import type { DiscriminatedRenderProps, InferProps } from "@zayne-labs/toolkit-react/utils";
import { isFunction } from "@zayne-labs/toolkit-type-helpers";
import { Dialog as DialogPrimitive } from "radix-ui";
import { useCallback, useMemo } from "react";
import { cnMerge } from "@/lib/utils/cn";
import { IconBox } from "../common/IconBox";

type ContextValue = {
	open: boolean;
	setOpen: (open: boolean) => void;
	onClose: () => void;
	onOpen: () => void;
};

const [DialogContextProvider, useDialogStateContext] = createCustomContext<ContextValue>();

function DialogRoot(props: InferProps<typeof DialogPrimitive.Root>) {
	// eslint-disable-next-line ts-eslint/unbound-method
	const { open: openProp, onOpenChange: setOpenProp, defaultOpen, ...restOfProps } = props;

	const savedSetOpenProp = useCallbackRef(setOpenProp);

	const [internalOpen, toggleInternalOpen] = useToggle(defaultOpen);

	// == Use the open prop if it is provided
	// == Otherwise, use the internal open state
	const open = openProp ?? internalOpen;

	const setOpen = useCallback(
		(value: boolean | ((value: boolean) => boolean)) => {
			const resolvedValue = isFunction(value) ? value(open) : value;

			// == Call the onOpenChange prop if the openProp is provided
			// == Otherwise, toggle the internal open state
			const selectedOpenChange = openProp ? savedSetOpenProp : toggleInternalOpen;

			selectedOpenChange(resolvedValue);
		},
		[open, openProp, savedSetOpenProp, toggleInternalOpen]
	);

	const onClose = useCallbackRef(() => setOpen(false));
	const onOpen = useCallbackRef(() => setOpen(true));

	const contextValue = useMemo(
		() => ({ open, setOpen, onClose, onOpen }) satisfies ContextValue,
		[onClose, onOpen, open, setOpen]
	);

	return (
		<DialogContextProvider value={contextValue}>
			<DialogPrimitive.Root
				{...restOfProps}
				data-slot="dialog-root"
				open={open}
				onOpenChange={setOpen}
			/>
		</DialogContextProvider>
	);
}

type RenderFn = (props: ContextValue) => React.ReactNode;

function DialogContext(props: DiscriminatedRenderProps<RenderFn>) {
	const { children, render } = props;
	const dialogCtx = useDialogStateContext();

	if (typeof children === "function") {
		return children(dialogCtx);
	}

	return render(dialogCtx);
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

function DialogClose(props: InferProps<typeof DialogPrimitive.Close>) {
	return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogContent(props: InferProps<typeof DialogPrimitive.Content> & { withCloseBtn?: boolean }) {
	const { className, children, withCloseBtn = true, ...restOfProps } = props;

	return (
		<DialogPortal>
			<DialogOverlay />

			<DialogPrimitive.Content
				data-slot="dialog-content"
				className={cnMerge(
					`fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%]
					translate-y-[-50%] gap-4 rounded-lg border bg-shadcn-background p-6 shadow-lg duration-200
					data-[state=closed]:animate-out data-[state=closed]:fade-out-0
					data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0
					data-[state=open]:zoom-in-95 sm:max-w-lg`,
					className
				)}
				{...restOfProps}
			>
				{children}

				{withCloseBtn && (
					<DialogClose
						className="absolute top-4 right-4 rounded-xs opacity-70 ring-offset-shadcn-background
							transition-opacity hover:opacity-100 focus:ring-2 focus:ring-shadcn-ring
							focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none
							data-[state=open]:bg-shadcn-accent data-[state=open]:text-shadcn-muted-foreground
							[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
					>
						<IconBox icon="lucide:x" className="size-4" />
						<span className="sr-only">Close</span>
					</DialogClose>
				)}
			</DialogPrimitive.Content>
		</DialogPortal>
	);
}

function DialogHeader(props: InferProps<"div">) {
	const { className, ...restOfProps } = props;

	return (
		<div
			data-slot="dialog-header"
			className={cnMerge("flex flex-col gap-2 text-center sm:text-left", className)}
			{...restOfProps}
		/>
	);
}

function DialogPortal(props: InferProps<typeof DialogPrimitive.Portal>) {
	return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
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

function DialogTrigger(props: InferProps<typeof DialogPrimitive.Trigger>) {
	const { onClick, ...restOfProps } = props;
	const { onOpen } = useDialogStateContext();

	return (
		<DialogPrimitive.Trigger
			data-slot="dialog-trigger"
			{...restOfProps}
			onClick={(event) => {
				onOpen();
				onClick?.(event);
			}}
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
export { useDialogStateContext };
