"use client";

import type { InferProps } from "@zayne-labs/toolkit-react/utils";
import { Tooltip as TooltipPrimitive } from "radix-ui";
import { cnMerge } from "@/lib/utils/cn";

function TooltipContextProvider(props: InferProps<typeof TooltipPrimitive.Provider>) {
	const { delayDuration = 0, ...restOfProps } = props;

	const TooltipPrimitiveContextProvider = TooltipPrimitive.Provider;

	return (
		<TooltipPrimitiveContextProvider
			data-slot="tooltip-provider"
			delayDuration={delayDuration}
			{...restOfProps}
		/>
	);
}

function TooltipRoot(props: InferProps<typeof TooltipPrimitive.Root>) {
	return (
		<TooltipContextProvider>
			<TooltipPrimitive.Root data-slot="tooltip" {...props} />
		</TooltipContextProvider>
	);
}

function TooltipTrigger(props: InferProps<typeof TooltipPrimitive.Trigger>) {
	return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent(props: InferProps<typeof TooltipPrimitive.Content>) {
	const { children, className, sideOffset = 0, ...restOfProps } = props;

	return (
		<TooltipPrimitive.Portal>
			<TooltipPrimitive.Content
				data-slot="tooltip-content"
				sideOffset={sideOffset}
				className={cnMerge(
					`z-50 w-fit origin-(--radix-tooltip-content-transform-origin) animate-in rounded-md
					bg-shadcn-primary px-3 py-1.5 text-xs text-balance text-shadcn-primary-foreground fade-in-0
					zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2
					data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2
					data-[state=closed]:animate-out data-[state=closed]:fade-out-0
					data-[state=closed]:zoom-out-95`,
					className
				)}
				{...restOfProps}
			>
				{children}
				<TooltipPrimitive.Arrow
					className="z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]
						bg-shadcn-primary fill-shadcn-primary"
				/>
			</TooltipPrimitive.Content>
		</TooltipPrimitive.Portal>
	);
}

export const Root = TooltipRoot;
export const Trigger = TooltipTrigger;
export const Content = TooltipContent;
export const ContextProvider = TooltipContextProvider;
