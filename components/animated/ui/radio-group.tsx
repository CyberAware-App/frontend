import type { InferProps } from "@zayne-labs/toolkit-react/utils";
import { IconBox } from "@/components/common/IconBox";
import { cnMerge } from "@/lib/utils/cn";
import * as RadioGroupPrimitive from "../primitives/radio-group-radix";

type RadioGroupRootProps = InferProps<typeof RadioGroupPrimitive.Root>;

function RadioGroupRoot(props: RadioGroupRootProps) {
	const { className, ...restOfProps } = props;

	return <RadioGroupPrimitive.Root className={cnMerge("grid gap-3", className)} {...restOfProps} />;
}

type RadioGroupItemProps = InferProps<typeof RadioGroupPrimitive.Item>;

function RadioGroupItem(props: RadioGroupItemProps) {
	const { children, className, ...restOfProps } = props;

	return (
		<RadioGroupPrimitive.Item
			className={cnMerge(
				`aspect-square size-4 shrink-0 rounded-full border border-neutral-200 text-neutral-900
				shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-neutral-950
				focus-visible:ring-[3px] focus-visible:ring-neutral-950/50 disabled:cursor-not-allowed
				disabled:opacity-50 aria-invalid:border-red-500 aria-invalid:ring-red-500/20`,
				className
			)}
			{...restOfProps}
		>
			{children ?? (
				<RadioGroupPrimitive.Indicator className="relative flex items-center justify-center">
					<IconBox
						icon="lucide:circle"
						className="absolute top-1/2 left-1/2 size-2 -translate-1/2 fill-shadcn-primary"
					/>
				</RadioGroupPrimitive.Indicator>
			)}
		</RadioGroupPrimitive.Item>
	);
}

export const Root = RadioGroupRoot;
export const Item = RadioGroupItem;

export const Indicator = RadioGroupPrimitive.Indicator;
