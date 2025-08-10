"use client";

import Image from "next/image";
import { Credits, ProtectedMain } from "@/app/-components";
import { LockIcon } from "@/components/icons/LockIcon";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress-animated";
import { cnJoin, cnMerge } from "@/lib/utils/cn";
import { DashboardSideBar } from "./-components/DashboardSideBar";
import { useQuery } from "@tanstack/react-query";
import { dashboardQuery, sessionQuery } from "@/lib/react-query/queryOptions";
import { Afam } from "@/public/assets";

const cardDetails = [
	{
		body: "Estimated time: 10mins",
		buttonText: "Start Module",
		id: 1,
		isSub: false,
		title: "Day 1: Cyber Security Foundation",
	},
	{ body: "Day 2", buttonText: "", id: 4, isSub: true, title: <LockIcon /> },
	{ body: "Day 3", buttonText: "", id: 5, isSub: true, title: <LockIcon /> },
	{ body: "Complete day 10 to activate", buttonText: "Take Quiz", id: 2, isSub: false, title: "Quiz" },
	{
		body: "A Certificate of completion would be sent to your E-mail If you pass the minimum mark of 80% in the quiz",
		buttonText: "Download certificate",
		id: 3,
		isSub: false,
		title: "Certificate",
	},
];

function DashboardPage() {
	const sessionQueryResult = useQuery(sessionQuery());
	const dashboardQueryResult = useQuery(dashboardQuery());

	return (
		<ProtectedMain className="flex-row">
			<DashboardSideBar dashboardQueryData={dashboardQueryResult.data} />

			<div className="flex flex-col gap-8 bg-white px-4 pt-[80px]">
				<section className="flex flex-col gap-5">
					<article className="flex items-center justify-between gap-5">
						<div className="flex flex-col gap-1">
							<p className="text-[28px] font-semibold text-cyberaware-aeces-blue">
								Hello, {sessionQueryResult.data?.data.first_name}!
							</p>
							<p className="text-[14px]">
								You’re on Module {(dashboardQueryResult.data?.data.completed_modules ?? 0) + 1} of{" "}
								{dashboardQueryResult.data?.data.total_modules}
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
							value={dashboardQueryResult.data?.data.percentage_completed}
							classNames={{
								base: "h-3 rounded-[20px] bg-[hsl(0,0%,85%)]",
								indicator: "rounded-[20px] bg-cyberaware-unizik-orange",
							}}
						/>
						<p className="text-cyberaware-aeces-blue">
							{dashboardQueryResult.data?.data.percentage_completed}% complete
						</p>
					</article>
				</section>

				<section className="grid gap-x-3 gap-y-3.5">
					{cardDetails.map(({ body, buttonText, id, isSub, title }) => {
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

								{!isSub && (
									<Button
										theme="orange"
										disabled={id !== 1}
										className={cnMerge("max-w-[150px] self-end")}
									>
										{buttonText}
									</Button>
								)}
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
