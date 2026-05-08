"use client";

import type { InferProps } from "@zayne-labs/toolkit-react/utils";
import { IconBox } from "@/components/common/IconBox";
import { cnMerge } from "@/lib/utils/cn";
import * as DialogPrimitive from "../primitives/dialog-radix";

type DialogProps = InferProps<typeof DialogPrimitive.Root>;

function DialogRoot(props: DialogProps) {
	return <DialogPrimitive.Root {...props} />;
}

type DialogTriggerProps = InferProps<typeof DialogPrimitive.Trigger>;

function DialogTrigger(props: DialogTriggerProps) {
	return <DialogPrimitive.Trigger {...props} />;
}

type DialogCloseProps = InferProps<typeof DialogPrimitive.Close>;

function DialogClose(props: DialogCloseProps) {
	return <DialogPrimitive.Close {...props} />;
}

type DialogOverlayProps = InferProps<typeof DialogPrimitive.Overlay>;

function DialogOverlay(props: DialogOverlayProps) {
	const { className, ...restOfProps } = props;

	return (
		<DialogPrimitive.Overlay
			className={cnMerge("fixed inset-0 z-50 bg-black/50", className)}
			{...restOfProps}
		/>
	);
}

type DialogContentProps = InferProps<typeof DialogPrimitive.Content> & {
	classNames?: {
		base?: string;
		overlay?: string;
	};
	withCloseButton?: boolean;
};

function DialogContent(props: DialogContentProps) {
	const { children, className, classNames, withCloseButton = true, ...restOfProps } = props;

	return (
		<DialogPrimitive.Portal>
			<DialogOverlay className={classNames?.overlay} />
			<DialogPrimitive.Content
				className={cnMerge(
					`fixed top-1/2 left-1/2 z-50 grid w-full max-w-lg -translate-1/2 gap-4 rounded-lg border
					bg-shadcn-background p-6 shadow-lg`,
					className,
					classNames?.base
				)}
				{...restOfProps}
			>
				{children}
				{withCloseButton && (
					<DialogPrimitive.Close
						className="absolute top-4 right-4 rounded-xs opacity-70 ring-offset-shadcn-background
							transition-opacity hover:opacity-100 focus:ring-2 focus:ring-shadcn-ring
							focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none
							data-[state=open]:bg-shadcn-accent data-[state=open]:text-shadcn-muted-foreground
							[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
					>
						<IconBox icon="lucide:x" />
						<span className="sr-only">Close</span>
					</DialogPrimitive.Close>
				)}
			</DialogPrimitive.Content>
		</DialogPrimitive.Portal>
	);
}

type DialogHeaderProps = InferProps<typeof DialogPrimitive.Header>;

function DialogHeader(props: DialogHeaderProps) {
	const { className, ...restOfProps } = props;

	return (
		<DialogPrimitive.Header
			className={cnMerge("flex flex-col gap-2 text-center sm:text-left", className)}
			{...restOfProps}
		/>
	);
}

type DialogFooterProps = InferProps<typeof DialogPrimitive.Footer>;

function DialogFooter(props: DialogFooterProps) {
	const { className, ...restOfProps } = props;

	return (
		<DialogPrimitive.Footer className={cnMerge("flex flex-col gap-2", className)} {...restOfProps} />
	);
}

type DialogTitleProps = InferProps<typeof DialogPrimitive.Title>;

function DialogTitle(props: DialogTitleProps) {
	const { className, ...restOfProps } = props;

	return (
		<DialogPrimitive.Title
			className={cnMerge("text-lg leading-none font-semibold", className)}
			{...restOfProps}
		/>
	);
}

type DialogDescriptionProps = InferProps<typeof DialogPrimitive.Description>;

function DialogDescription(props: DialogDescriptionProps) {
	const { className, ...restOfProps } = props;

	return (
		<DialogPrimitive.Description
			className={cnMerge("text-sm text-shadcn-muted-foreground", className)}
			{...restOfProps}
		/>
	);
}

export {
	DialogRoot as Root,
	DialogTrigger as Trigger,
	DialogClose as Close,
	DialogOverlay as Overlay,
	DialogContent as Content,
	DialogHeader as Header,
	DialogFooter as Footer,
	DialogTitle as Title,
	DialogDescription as Description,
};
