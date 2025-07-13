import type { InferProps } from "@zayne-labs/toolkit-react/utils";
import { OTPInput, OTPInputContext } from "input-otp";
import { use } from "react";
import { cnMerge } from "@/lib/utils/cn";
import { IconBox } from "../common/IconBox";

function InputOTPRoot(
	props: InferProps<typeof OTPInput> & { classNames?: { container?: string; input?: string } }
) {
	const { containerClassName, className, classNames, ...restOfProps } = props;

	return (
		<OTPInput
			data-slot="input-otp"
			containerClassName={cnMerge(
				"flex items-center gap-2 has-disabled:opacity-50",
				containerClassName,
				classNames?.container
			)}
			className={cnMerge("disabled:cursor-not-allowed", className, classNames?.input)}
			{...restOfProps}
		/>
	);
}

function InputOTPGroup(props: InferProps<"div">) {
	const { className, ...restOfProps } = props;

	return (
		<div
			data-slot="input-otp-group"
			className={cnMerge("flex items-center", className)}
			{...restOfProps}
		/>
	);
}

function InputOTPSlot(
	props: InferProps<"div"> & { index: number; classNames?: { base?: string; isActive?: string } }
) {
	const { index, className, classNames, ...restOfProps } = props;

	const inputOTPContext = use(OTPInputContext);

	const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index] ?? {};

	return (
		<div
			data-slot="input-otp-slot"
			data-active={isActive}
			className={cnMerge(
				`relative flex size-9 items-center justify-center border border-shadcn-input text-sm shadow-xs
				transition-all outline-none aria-invalid:border-shadcn-destructive data-[active=true]:z-10
				data-[active=true]:border-shadcn-ring data-[active=true]:ring-[3px]
				data-[active=true]:ring-shadcn-ring/50
				data-[active=true]:aria-invalid:border-shadcn-destructive
				data-[active=true]:aria-invalid:ring-shadcn-destructive/20 dark:bg-shadcn-input/30
				dark:data-[active=true]:aria-invalid:ring-shadcn-destructive/40`,
				isActive && classNames?.isActive,
				className,
				classNames?.base
			)}
			{...restOfProps}
		>
			{char}
			{hasFakeCaret && (
				<div className="pointer-events-none absolute inset-0 flex items-center justify-center">
					<div className="h-4 w-px animate-caret-blink bg-shadcn-foreground duration-1000" />
				</div>
			)}
		</div>
	);
}

function InputOTPSeparator(props: InferProps<"div">) {
	return (
		<div data-slot="input-otp-separator" role="separator" {...props}>
			<IconBox icon="radix-icons:dash" />
		</div>
	);
}

export const Root = InputOTPRoot;
export const Group = InputOTPGroup;
export const Slot = InputOTPSlot;
export const Separator = InputOTPSeparator;
