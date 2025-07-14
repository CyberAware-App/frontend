import React from "react";
import Image from "next/image";
import { Main } from "@/app/-components";
import { LockIcon } from "@/components/icons/LockIcon";
import { Button } from "@/components/ui/button";
import { UnizikIcon } from "@/components/icons/unizik-logo";
import { Aeces } from "@/components/icons/aeces";
import Afam from "@/public/afamHeadshot.jpg";
import SideBar from "./-components/sideBar";

const cardDetails = [
	{
		id: 1,
		title: "Day 1: Cyber Security Foundation",
		body: "Estimated time: 10mins",
		buttonText: "Start Module",
		isSub: false,
	},
	{ id: 4, body: "Day 2", title: <LockIcon />, buttonText: "", isSub: true },
	{ id: 5, body: "Day 3", title: <LockIcon />, buttonText: "", isSub: true },
	{ id: 2, title: "Quiz", body: "Complete day 10 to activate", buttonText: "Take Quiz", isSub: false },
	{
		id: 3,
		title: "Certificate",
		body: "A Certificate of completion would be sent to your E-mail If you pass the minimum mark of 80% in the quiz",
		buttonText: "Download certificate",
		isSub: false,
	},
];
const page = () => {
	return (
		<Main>
			<div className="flex w-full">
				<SideBar />

				{/* Main Page */}
				<div className="flex flex-col gap-3 bg-white px-4 pt-[80px] pb-5">
					<div className="flex justify-between gap-5">
						<div className="flex flex-col gap-1">
							{/* Name and excerpt */}
							<p className="text-[28px] font-semibold text-[#040524]">Hello, {`Aniekwe`}!</p>
							<p>You’re on Day {1} of 10</p>
						</div>
						<Image
							src={Afam}
							alt="user"
							className="h-[50px] w-[50px] rounded-full border-[2px] border-solid
								border-cyberaware-unizik-orange"
						/>
						{/* image */}
					</div>
					<div className="w-full rounded-full bg-[#D9D9D9]">
						<div className="h-3 w-[10%] rounded-full bg-cyberaware-unizik-orange" />
					</div>
					{/* progress bar */}
					<p>10% complete</p>
					<div className="flex flex-wrap gap-1">
						{cardDetails.map(({ id, title, body, buttonText, isSub }) => {
							return (
								<div
									key={id}
									className={`flex flex-col gap-2 bg-cyberaware-neutral-gray-lighter px-5 py-6
									${!isSub ? "w-full" : "w-[49%]"}`}
								>
									<div className={isSub ? "flex flex-col items-center gap-4" : ""}>
										<p
											className={`${isSub ? "text-[24px]" : "text-[22px]"} font-semibold
											text-cyberaware-aeces-blue`}
										>
											{title}
										</p>
										<p
											className={
												isSub ?
													"text-[24px] font-semibold text-cyberaware-aeces-blue"
												:	"text-[10px]"
											}
										>
											{body}
										</p>
									</div>
									<div className="flex justify-end">
										{!isSub && (
											<Button theme={id === 1 ? "orange" : "blue-ghost"} className="w-[50%]">
												{buttonText}
											</Button>
										)}
									</div>
								</div>
							);
						})}
					</div>
					<div className="flex items-center gap-4 py-4 text-[10px]">
						<p>Powered By:</p>
						<div className="">
							<div className="flex items-center gap-1">
								<Aeces />
								<p>Association and Electronic and computer engineering students,</p>
							</div>
							<div className="flex items-center">
								<UnizikIcon />
								<p>Nnamdi Azikiwe University, Awka</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Main>
	);
};

export default page;
