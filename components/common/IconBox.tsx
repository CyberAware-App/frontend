"use client";

import { Icon as IconifyIcon, type IconifyIcon as IconifyIconType, type IconProps } from "@iconify/react";

// import { type MoniconProps, camelCasedProps, getIconDetails } from "@monicon/icon-loader";
// import type { InferProps } from "@zayne-labs/toolkit-react/utils";
// import { isString } from "@zayne-labs/toolkit-type-helpers";
// import { useMemo } from "react";

// export type MoniconIconBoxProps = Omit<InferProps<"svg">, "strokeWidth">
// 	& Omit<MoniconProps, "name"> & { icon: MoniconProps["name"]; type: "local" };

type IconifyIconBoxProps = Omit<IconProps, "icon"> & {
	icon: string | IconifyIconType;
	type?: "online";
};

// type IconBoxProps = IconifyIconBoxProps | MoniconIconBoxProps;
type IconBoxProps = IconifyIconBoxProps;

export function IconBox(props: IconBoxProps) {
	const { icon, type = "online", ...restOfProps } = props;

	switch (type) {
		// case "local": {
		// 	if (!isString(icon)) return;
		// 	// eslint-disable-next-line ts-eslint/no-unnecessary-type-assertion
		// 	return <Monicon icon={icon as MoniconProps["name"]} {...(restOfProps as object)} />;
		// }

		// eslint-disable-next-line ts-eslint/no-unnecessary-condition
		case "online": {
			return <IconifyIcon icon={icon} {...(restOfProps as object)} />;
		}

		default: {
			throw new Error("Unknown IconType");
		}
	}
}

// export function Monicon(props: Omit<MoniconIconBoxProps, "type">) {
// 	const { color, height = "1em", icon, size, strokeWidth, width = "1em", ...restOfProps } = props;

// 	const details = useMemo(
// 		() =>
// 			getIconDetails({
// 				color,
// 				name: icon,
// 				size,
// 				strokeWidth,
// 			}),
// 		[color, icon, size, strokeWidth]
// 	);

// 	const attributes = useMemo(() => camelCasedProps(details.attributes), [details.attributes]);

// 	return (
// 		<svg
// 			{...attributes}
// 			{...restOfProps}
// 			width={width}
// 			height={height}
// 			// eslint-disable-next-line react-dom/no-dangerously-set-innerhtml
// 			dangerouslySetInnerHTML={{ __html: details.innerHtml }}
// 		/>
// 	);
// }
