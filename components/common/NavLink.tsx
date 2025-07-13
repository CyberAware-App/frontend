import type { InferProps } from "@zayne-labs/toolkit-react/utils";
import type { LinkProps } from "next/link";
import Link from "next/link";

function NavLink(props: LinkProps & Omit<InferProps<"a">, keyof LinkProps>) {
	return <Link {...props} />;
}

export { NavLink };
