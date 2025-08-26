"use client";

import { Avatar as AvatarPrimitive } from "radix-ui";
import { cnMerge } from "@/lib/utils/cn";

function AvatarRoot(props: React.ComponentProps<typeof AvatarPrimitive.Root>) {
	const { className, ...restOfProps } = props;
	return (
		<AvatarPrimitive.Root
			data-slot="avatar-root"
			className={cnMerge("relative flex size-8 shrink-0 overflow-hidden rounded-full", className)}
			{...restOfProps}
		/>
	);
}

function AvatarImage(props: React.ComponentProps<typeof AvatarPrimitive.Image>) {
	const { className, ...restOfProps } = props;
	return (
		<AvatarPrimitive.Image
			data-slot="avatar-image"
			className={cnMerge("aspect-square size-full", className)}
			{...restOfProps}
		/>
	);
}

function AvatarFallback(props: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
	const { className, ...restOfProps } = props;

	return (
		<AvatarPrimitive.Fallback
			data-slot="avatar-fallback"
			className={cnMerge(
				"flex size-full items-center justify-center rounded-full bg-shadcn-muted",
				className
			)}
			{...restOfProps}
		/>
	);
}

export const Root = AvatarRoot;
export const Image = AvatarImage;
export const Fallback = AvatarFallback;
