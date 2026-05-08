"use client";

import type { UrlObject } from "node:url";
import { isString } from "@zayne-labs/toolkit-type-helpers";
import type { Route } from "next";
import Link, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import type { AppRoutes } from "@/.next/dev/types/routes";

export type MainAppRoutes<TRouteType extends string = AppRoutes> = Route<TRouteType>;

function NavLink<TRouteType extends string = AppRoutes>(
	props: Omit<LinkProps<TRouteType>, "href"> & {
		href:
			| (Omit<UrlObject, "pathname"> & { pathname: MainAppRoutes<TRouteType> })
			| MainAppRoutes<TRouteType>;
	}
) {
	const { children, href, ...restOfProps } = props;

	const pathname = usePathname();

	const isActive = isString(href) ? pathname === href : pathname === href.pathname;

	return (
		<Link href={href} data-active={isActive} {...restOfProps}>
			{children}
		</Link>
	);
}

export { NavLink };
