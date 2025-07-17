"use client";

import { Presence } from "@radix-ui/react-presence";
import { useToggle } from "@zayne-labs/toolkit-react";
import { ForWithWrapper } from "@zayne-labs/ui-react/common/for";
import Image from "next/image";
import { IconBox } from "@/components/common/IconBox";
import { NavLink } from "@/components/common/NavLink";
import { Teleport } from "@/components/common/teleport";
import { HamburgerIcon, XIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { cnMerge } from "@/lib/utils/cn";
import { logoSmall } from "@/public/assets";

function NavBar() {
	const [isNavShow, toggleNavShow] = useToggle(false);

	return (
		<header
			className="absolute top-[72px] isolate z-100 flex w-full max-w-[312px] items-center
				justify-between bg-cyberaware-aeces-blue py-1 pr-5 pl-1"
		>
			<NavLink href="/" className="flex items-center gap-1">
				<Image src={logoSmall} alt="Logo" className="w-[55px]" />
				<h3 className="font-medium text-white">CyberAware</h3>
			</NavLink>

			<MobileNavigation isNavShow={isNavShow} toggleNavShow={toggleNavShow} />

			<Button unstyled={true} onClick={toggleNavShow}>
				<HamburgerIcon />
			</Button>
		</header>
	);
}

export { NavBar };

type MobileNavProps = {
	className?: string;
	isNavShow: boolean;
	toggleNavShow: () => void;
};

const linkItems = [
	{
		title: "Home",
		icon: "material-symbols:home",
		href: "/",
	},
	{
		title: "Contact",
		icon: "material-symbols:call-sharp",
		href: "/contact",
	},
	{
		title: "Module",
		icon: "ion:grid-sharp",
		href: "/module",
	},
];

function MobileNavigation(props: MobileNavProps) {
	const { className, isNavShow, toggleNavShow } = props;

	return (
		<Teleport to="#main" insertPosition="afterbegin">
			<Presence present={isNavShow}>
				<div
					className={cnMerge(
						"absolute inset-0 z-200 backdrop-blur-xs",
						isNavShow ? "animate-fade-in" : "animate-fade-out"
					)}
					onClick={toggleNavShow}
				/>
			</Presence>

			<Presence present={isNavShow}>
				<aside
					className={cnMerge(
						`absolute inset-[4px_auto_4px_4px] z-200 flex max-w-[380px] flex-col items-center gap-7
						overflow-x-hidden bg-cyberaware-aeces-blue pt-[150px] text-white shadow-lg
						shadow-cyberaware-light-orange`,
						isNavShow ? "animate-nav-show" : "animate-nav-close",
						className
					)}
					onClick={(event) => {
						const element = event.target as HTMLElement;

						element.tagName === "A" && toggleNavShow();
					}}
				>
					<ForWithWrapper
						as="nav"
						className="flex flex-col gap-5 font-medium text-nowrap"
						each={linkItems}
						render={(linkItem) => (
							<NavLink
								key={linkItem.title}
								href={linkItem.href}
								className="flex items-center gap-2"
							>
								<IconBox icon={linkItem.icon} />
								{linkItem.title}
							</NavLink>
						)}
					/>

					<Button unstyled={true} className="absolute top-8 right-8" onClick={toggleNavShow}>
						<XIcon />
					</Button>
				</aside>
			</Presence>
		</Teleport>
	);
}
