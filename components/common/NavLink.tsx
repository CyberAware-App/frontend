import type { InferProps } from "@zayne-labs/toolkit-react/utils";
import type { AnyString } from "@zayne-labs/toolkit-type-helpers";
import type { LinkProps } from "next/link";
import Link from "next/link";

type ActualLinkProps = Omit<LinkProps, "href"> & { href: AnyString | AppRoutes };

type NavLinkProps = ActualLinkProps & Omit<InferProps<"a">, keyof ActualLinkProps>;

function NavLink(props: NavLinkProps) {
	return <Link {...props} />;
}

export { NavLink };
