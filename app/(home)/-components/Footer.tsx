import { ForWithWrapper } from "@zayne-labs/ui-react/common/for";
import Image from "next/image";
import { NavLink } from "@/components/common/NavLink";
import { logoLarge } from "@/public/assets";

const footerLinks = [
	{
		href: "/privacy-policy",
		title: "Privacy policy",
	},
	{
		href: "/contact",
		title: "Contact",
	},
	{
		href: "/modules",
		title: "Modules",
	},
	{
		href: "/partners",
		title: "Partners",
	},
];

function Footer() {
	return (
		<footer className="flex flex-col gap-12 bg-cyberaware-aeces-blue px-12 pt-11 pb-8 text-white">
			<div className="flex items-center">
				<Image src={logoLarge} alt="Logo" className="max-w-[106px]" />
				<h3 className="text-[32px] font-semibold">CyberAware</h3>
			</div>

			<ForWithWrapper
				className="flex flex-col gap-1.5 px-4.5 text-[14px]"
				each={footerLinks}
				renderItem={(item) => (
					<li key={item.title}>
						<NavLink href={item.href}>{item.title}</NavLink>
					</li>
				)}
			/>

			<p className="font-medium">© 2025 CyberAware. All rights reserved.</p>
		</footer>
	);
}

export { Footer };
