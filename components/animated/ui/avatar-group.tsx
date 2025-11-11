import * as AvatarGroupPrimitive from "@/components/animated/primitives/avatar-group";
import { cnMerge } from "@/lib/utils/cn";
import * as motion from "motion/react-client";

function AvatarGroupRoot(props: React.ComponentProps<typeof AvatarGroupPrimitive.Root>) {
	const { className, invertOverlap = true, ...restOfProps } = props;

	return (
		<AvatarGroupPrimitive.Root
			className={cnMerge("-space-x-3", className)}
			invertOverlap={invertOverlap}
			{...restOfProps}
		/>
	);
}

type AvatarGroupTooltipProps = Omit<
	React.ComponentProps<typeof AvatarGroupPrimitive.Tooltip>,
	"asChild"
> & {
	children: React.ReactNode;
	classNames?: {
		arrow?: string;
		base?: string;
	};
	layout?: "position" | "preserve-aspect" | "size" | boolean;
};

function AvatarGroupTooltip(props: AvatarGroupTooltipProps) {
	const { children, className, classNames, layout = "preserve-aspect", ...restOfProps } = props;

	return (
		<AvatarGroupPrimitive.Tooltip
			className={cnMerge(
				`z-50 w-fit rounded-md bg-shadcn-primary px-3 py-1.5 text-xs text-balance
				text-shadcn-primary-foreground`,
				className,
				classNames?.base
			)}
			{...restOfProps}
		>
			<motion.div layout={layout} className="overflow-hidden">
				{children}
			</motion.div>

			<AvatarGroupPrimitive.TooltipArrow
				className={cnMerge(
					`size-3 fill-shadcn-primary data-[side=bottom]:translate-y-[1px]
					data-[side=left]:translate-x-[-1px] data-[side=right]:translate-x-[1px]
					data-[side=top]:translate-y-[-1px]`,
					classNames?.arrow
				)}
				tipRadius={2}
			/>
		</AvatarGroupPrimitive.Tooltip>
	);
}

export const Root = AvatarGroupRoot;

export const Tooltip = AvatarGroupTooltip;
