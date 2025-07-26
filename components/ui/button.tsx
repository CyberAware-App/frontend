"use client";

import type { InferProps, PolymorphicProps } from "@zayne-labs/toolkit-react/utils";
import type { Prettify } from "@zayne-labs/toolkit-type-helpers";
import { tv, type VariantProps } from "tailwind-variants";
import { Slot } from "../common/slot";
import { SpinnerIcon } from "../icons";

export type ButtonProps = InferProps<"button">
	& Prettify<
		VariantProps<typeof buttonVariants> & {
			asChild?: boolean;
			isLoading?: boolean;
			unstyled?: boolean;
		}
	>;

const buttonVariants = tv({
	base: "flex h-[52px] w-full min-w-fit items-center justify-center p-3.5 text-base font-medium",

	defaultVariants: {
		theme: "orange",
	},

	/* eslint-disable perfectionist/sort-objects */
	variants: {
		isLoading: {
			true: "grid",
		},

		theme: {
			"blue-ghost": "border-2 border-cyberaware-aeces-blue bg-transparent",
			orange: "bg-cyberaware-unizik-orange text-white",
			white: "bg-white text-cyberaware-aeces-blue",
		},

		disabled: {
			true: "cursor-not-allowed bg-cyberaware-neutral-gray-light",
		},

		isDisabled: {
			true: "cursor-not-allowed opacity-60",
		},
	},
	/* eslint-enable perfectionist/sort-objects */
});

function Button<TElement extends React.ElementType = "button">(
	props: PolymorphicProps<TElement, ButtonProps>
) {
	const {
		as: Element = "button",
		asChild,
		children,
		className,
		disabled,
		isDisabled = disabled,
		isLoading = false,
		theme,
		type = "button",
		unstyled,
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
		<Component
			type={type}
			className={BTN_CLASSES}
			disabled={disabled ?? isDisabled}
			{...extraButtonProps}
		>
			{isLoading ? withIcon : children}
		</Component>
	);
}

export { Button };
