import * as TooltipPrimitive from "@/components/animated/primitives/tooltip";
import { cnMerge } from "@/lib/utils/cn";
import { motion } from "motion/react";

type TooltipProviderProps = React.ComponentProps<typeof TooltipPrimitive.Provider>;

function TooltipProvider(props: TooltipProviderProps) {
	const { openDelay = 0, ...restOfProps } = props;

	// eslint-disable-next-line react-x/no-context-provider
	return <TooltipPrimitive.Provider openDelay={openDelay} {...restOfProps} />;
}

function TooltipRoot(props: React.ComponentProps<typeof TooltipPrimitive.Root> & TooltipProviderProps) {
	const { closeDelay, id, openDelay = 0, sideOffset = 4, transition, ...restOfProps } = props;

	return (
		<TooltipProvider openDelay={openDelay} id={id} closeDelay={closeDelay} transition={transition}>
			<TooltipPrimitive.Root sideOffset={sideOffset} {...restOfProps} />
		</TooltipProvider>
	);
}

function TooltipTrigger(props: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
	return <TooltipPrimitive.Trigger {...props} />;
}

type TooltipContentProps = Omit<React.ComponentProps<typeof TooltipPrimitive.Content>, "asChild"> & {
	children: React.ReactNode;
	classNames?: {
		arrow?: string;
		base?: string;
	};
	layout?: "position" | "preserve-aspect" | "size" | boolean;
};

function TooltipContent(props: TooltipContentProps) {
	const { children, className, classNames, layout = "preserve-aspect", ...restOfProps } = props;

	return (
		<TooltipPrimitive.Content
			className={cnMerge(
				"z-50 w-fit rounded-md bg-shadcn-primary text-shadcn-primary-foreground",
				className,
				classNames?.base
			)}
			{...restOfProps}
		>
			<motion.div className="overflow-hidden px-3 py-1.5 text-xs text-balance">
				<motion.div layout={layout}>{children}</motion.div>
			</motion.div>

			<TooltipPrimitive.Arrow
				className={cnMerge(
					`size-3 fill-shadcn-primary data-[side=bottom]:translate-y-px
					data-[side=left]:-translate-x-px data-[side=right]:translate-x-px
					data-[side=top]:-translate-y-px`,
					classNames?.arrow
				)}
				tipRadius={2}
			/>
		</TooltipPrimitive.Content>
	);
}

export const Provider = TooltipProvider;

export const Root = TooltipRoot;
export const Trigger = TooltipTrigger;
export const Content = TooltipContent;
