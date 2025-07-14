import { HamburgerIcon } from "@/components/icons";
import { Arrow } from "@/components/icons/arrow";
import { logoSmall } from "@/public/assets";
import Image from "next/image";
import React from "react";

const SideBar = () => {
	return (
		<div
			className="relative flex max-h-full w-[50%] flex-col gap-3 bg-cyberaware-aeces-blue pt-[80px]
				pb-5"
		>
			<Image src={logoSmall} alt="Logo" className="w-[55px]" />
			<HamburgerIcon className="mx-auto" />
			<span className="absolute top-[50%] right-2">
				<Arrow />
			</span>
		</div>
	);
};

export default SideBar;
