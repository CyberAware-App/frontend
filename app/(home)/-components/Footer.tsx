import { ForWithWrapper } from "@zayne-labs/ui-react/common/for";
import Image from "next/image";
import { logoLarge } from "@/public/assets";

const footerLinks = [
	{
		title: "Privacy policy",
		href: "/privacy-policy",
	},
	{
		title: "Contact",
		href: "/contact",
	},
	{
		title: "Modules",
		href: "/modules",
	},
	{
		title: "Partners",
		href: "/partners",
	},
];

function Footer() {
	return (
		<footer className="flex flex-col gap-12 bg-cyberaware-aeces-blue px-[72px] pt-9 pb-13 text-white">
			<div className="flex items-center">
				<Image src={logoLarge} alt="Logo" className="max-w-[106px]" />
				<h3 className="text-[32px] font-semibold">CyberAware</h3>
			</div>
			<ForWithWrapper
				className="flex flex-col gap-1.5 text-[14px]"
				each={footerLinks}
				render={(item) => <li>{item.title}</li>}
			/>
			<p className="font-medium">© 2025 CyberAware. All rights reserved.</p>
		</footer>
	);
}

export { Footer };
