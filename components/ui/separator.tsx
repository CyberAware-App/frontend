"use client";

import { Separator as SeparatorPrimitive } from "radix-ui";
import { cnMerge } from "@/lib/utils/cn";

function Separator(props: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
	const { className, decorative = true, orientation = "horizontal", ...restOfProps } = props;

	return (
		<SeparatorPrimitive.Root
			data-slot="separator"
			decorative={decorative}
			orientation={orientation}
			className={cnMerge(
				`shrink-0 bg-shadcn-border data-[orientation=horizontal]:h-px
				data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full
				data-[orientation=vertical]:w-px`,
				className
			)}
			{...restOfProps}
		/>
	);
}

export { Separator };
