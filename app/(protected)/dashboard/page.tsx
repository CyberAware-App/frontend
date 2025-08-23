"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Credits, ProtectedMain } from "@/app/-components";
import { NavLink } from "@/components/common/NavLink";
import { LockIcon } from "@/components/icons/LockIcon";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress-animated";
import { dashboardQuery, sessionQuery } from "@/lib/react-query/queryOptions";
import { cnJoin, cnMerge } from "@/lib/utils/cn";
import { Afam } from "@/public/assets";
import { DashboardSideBar } from "./-components/DashboardSideBar";

function DashboardPage() {
	const sessionQueryResult = useQuery(sessionQuery());
	const dashboardQueryResult = useQuery(dashboardQuery());

	const ongoingModule = dashboardQueryResult.data?.modules.find((module) => module.status === "ongoing");

	const cardDetails = [
		{
			body: "Estimated time: 10mins",
			button: (
				<Button theme="orange" className="max-w-[150px] self-end" asChild={true}>
					<NavLink href={`/dashboard/module/${ongoingModule?.id}`}>Start Module</NavLink>
				</Button>
			),
			id: 1,
			isSub: false,
			title: `${ongoingModule?.title}: ${ongoingModule?.name}`,
		},
		{ body: "Day 2", button: null, id: 2, isSub: true, title: <LockIcon /> },
		{ body: "Day 3", button: null, id: 3, isSub: true, title: <LockIcon /> },
		{
			body: "Complete module 10 to activate",
			button: (
				<Button theme="orange" disabled={true} className="max-w-[150px] self-end">
					Take Quiz
				</Button>
			),
			id: 4,
			isSub: false,
			title: "Quiz",
		},
		{
			body: "A Certificate of completion would be sent to your E-mail If you pass the minimum mark of 80% in the quiz",
			button: (
				<Button theme="orange" disabled={true} className={cnMerge("max-w-[150px] self-end")}>
					Download certificate
				</Button>
			),
			id: 5,
			isSub: false,
			title: "Certificate",
		},
	];

	return (
		<ProtectedMain className="flex-row">
			<DashboardSideBar />

			<div className="flex flex-col gap-8 bg-white px-4 pt-[80px]">
				<section className="flex flex-col gap-5">
					<article className="flex items-center justify-between gap-5">
						<div className="flex flex-col gap-1">
							<p className="text-[28px] font-semibold text-cyberaware-aeces-blue">
								Hello, {sessionQueryResult.data?.data.first_name}!
							</p>
							<p className="text-[14px]">
								You’re on Module {(dashboardQueryResult.data?.completed_modules ?? 0) + 1} of{" "}
								{dashboardQueryResult.data?.total_modules}
							</p>
						</div>

						<Image
							src={Afam}
							alt="user"
							className="size-[50px] rounded-full border-[2px] border-solid
								border-cyberaware-unizik-orange"
						/>
					</article>

					<article className="flex flex-col gap-3">
						<Progress
							value={dashboardQueryResult.data?.percentage_completed}
							classNames={{
								base: "h-3 rounded-[20px] bg-[hsl(0,0%,85%)]",
								indicator: "rounded-[20px] bg-cyberaware-unizik-orange",
							}}
						/>
						<p className="text-cyberaware-aeces-blue">
							{dashboardQueryResult.data?.percentage_completed}% complete
						</p>
					</article>
				</section>

				<section className="grid gap-x-3 gap-y-3.5">
					{cardDetails.map(({ body, button, id, isSub, title }) => {
						return (
							<div
								key={id}
								className={cnJoin(
									"flex flex-col gap-5 bg-cyberaware-neutral-gray-lighter px-5 py-6",
									isSub ? "col-span-1" : "col-span-2"
								)}
							>
								<div className={cnJoin("flex flex-col", isSub ? "items-center gap-3.5" : "gap-2")}>
									<h4 className="text-[22px] font-semibold text-cyberaware-aeces-blue">
										{title}
									</h4>

									<p
										className={cnJoin(
											isSub ?
												"text-[22px] font-semibold text-cyberaware-aeces-blue"
											:	"text-[10px]"
										)}
									>
										{body}
									</p>
								</div>

								{button}
							</div>
						);
					})}
				</section>

				<footer className="flex items-center gap-4 pb-6 text-[10px]">
					<Credits />
				</footer>
			</div>
		</ProtectedMain>
	);
}

export default DashboardPage;
