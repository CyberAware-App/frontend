"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Credits } from "@/app/-components";
import { NavLink } from "@/components/common/NavLink";
import { Button } from "@/components/ui/button";
import { sessionQuery } from "@/lib/react-query/queryOptions";
import { eyeShield } from "@/public/assets/landing";
import { NavBar } from "./NavBar";

function HeroSection() {
	const sessionQueryData = useQuery(sessionQuery());

	return (
		<section className="mx-4 mt-4 flex flex-col gap-8 bg-white px-[45px] pt-[76px] pb-4">
			<NavBar />

			<h1 className="text-center text-[36px] font-bold text-cyberaware-aeces-blue">
				Be CyberAware.
				<span className="inline-flex items-center">
					Stay <Image src={eyeShield} alt="Eye Shield" className="mt-1 ml-2 size-6" /> Secure
				</span>
				.
			</h1>

			<p className="text-center text-[16px] text-cyberaware-body-color">
				Learn how to protect your digital world within just 10 modules. Designed for lecturers, staff,
				and students.
			</p>

			<div className="flex items-center justify-center gap-3.5">
				<Button theme="blue-ghost" className="max-w-[118px]">
					Learn More
				</Button>

				<Button className="max-w-[175px]" asChild={true}>
					{sessionQueryData.data ?
						<NavLink href="/dashboard">Go to dashboard</NavLink>
					:	<NavLink href="/auth/signin">Get Started</NavLink>}
				</Button>
			</div>

			<Credits />
		</section>
	);
}

export { HeroSection };
