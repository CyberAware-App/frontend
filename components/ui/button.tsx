"use client";

import type { InferProps, PolymorphicProps } from "@zayne-labs/toolkit-react/utils";
import type { Prettify } from "@zayne-labs/toolkit-type-helpers";
import { tv, type VariantProps } from "tailwind-variants";
import { Slot } from "../common/slot";
import { SpinnerIcon } from "../icons";

export type ButtonProps = Prettify<
	{
		isLoading?: boolean;
		asChild?: boolean;
		unstyled?: boolean;
	} & VariantProps<typeof buttonVariants>
>
	& InferProps<"button">;

const buttonVariants = tv({
	base: "flex h-12 w-full min-w-fit items-center justify-center text-base font-medium",

	variants: {
		theme: {
			orange: "bg-cyberaware-unizik-orange text-white",

			"blue-ghost": "border-2 border-cyberaware-aceces-blue bg-transparent",
		},

		isLoading: {
			true: "grid",
		},

		disabled: {
			true: "cursor-not-allowed",
		},

		isDisabled: {
			// true: `border-medinfo-dark-4 bg-medinfo-disabled-fill text-medinfo-dark-4 cursor-not-allowed
			// border-2`,
			true: "",
		},
	},

	defaultVariants: {
		theme: "orange",
	},
});

function Button<TElement extends React.ElementType = "button">(
	props: PolymorphicProps<TElement, ButtonProps>
) {
	const {
		as: Element = "button",
		disabled,
		asChild,
		isLoading = false,
		isDisabled = disabled,
		children,
		unstyled,
		className,
		type = "button",
		theme,
		...extraButtonProps
	} = props;

	const Component = asChild ? Slot.Root : Element;

	const BTN_CLASSES =
		!unstyled ?
			buttonVariants({
				className,
				disabled,
				isDisabled,
				isLoading,
				theme,
			})
		:	className;

	const withIcon = (
		<>
			<Slot.Slottable>
				<div className="invisible [grid-area:1/1]">{children}</div>
			</Slot.Slottable>

			<span className="flex justify-center [grid-area:1/1]">
				<SpinnerIcon />
			</span>
		</>
	);

	// == This technique helps prevents content shift when replacing children with spinner icon
	return (
		<Component type={type} className={BTN_CLASSES} disabled={disabled} {...extraButtonProps}>
			{isLoading ? withIcon : children}
		</Component>
	);
}

export { Button };
