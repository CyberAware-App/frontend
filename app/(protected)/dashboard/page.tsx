"use client";

import { useRouter } from "@bprogress/next";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Credits, Main } from "@/app/-components";
import { UserAvatar } from "@/app/-components/UserAvatar";
import { ProgressAnimated } from "@/components/animated/ui";
import { IconBox } from "@/components/common/IconBox";
import { NavLink } from "@/components/common/NavLink";
import { LockIcon } from "@/components/icons/LockIcon";
import { Button } from "@/components/ui/button";
import { downloadCertificateMutation } from "@/lib/react-query/mutationOptions";
import { certificateQuery, dashboardQuery, sessionQuery } from "@/lib/react-query/queryOptions";
import { cnJoin, cnMerge } from "@/lib/utils/cn";
import { withProtection } from "../-components/withProtection";
import { LoadingScreen } from "../../-components/LoadingScreen";
import { DashboardSideBar } from "./DashboardSideBar";

function DashboardPage() {
	const sessionQueryResult = useQuery(sessionQuery());
	const dashboardQueryResult = useQuery(dashboardQuery());
	const certificateQueryResult = useQuery(certificateQuery());

	const certificateId = certificateQueryResult.data?.certificate_id;

	const downloadCertificateMutationResult = useMutation(downloadCertificateMutation());

	const ongoingModule = dashboardQueryResult.data?.modules.find((module) => module.status === "ongoing");
	const completedModulesCount = dashboardQueryResult.data?.completed_modules_count ?? 0;
	const isAllModulesCompleted = completedModulesCount === 10;

	const router = useRouter();

	const cardDetails = [
		{
			body:
				ongoingModule ? "Estimated time: 10mins" : (
					"Warning: This exam is timed for 35mins. It will be automatically submitted after the time expires."
				),
			button: (
				<Button theme="orange" className="max-w-[150px] self-end" asChild={true}>
					<NavLink href={ongoingModule ? `/dashboard/module/${ongoingModule.id}` : "/dashboard/exam"}>
						{ongoingModule ? "Start Module" : "Start Exam"}
					</NavLink>
				</Button>
			),
			id: 1,
			isSub: false,
			title: ongoingModule ? `${ongoingModule.title}: ${ongoingModule.name}` : "Exam",
		},
		{
			body:
				isAllModulesCompleted ?
					`Module ${completedModulesCount - 1}`
				:	`Module ${completedModulesCount + 1}`,
			button: null,
			id: 2,
			isSub: true,
			title:
				isAllModulesCompleted ?
					<IconBox icon="material-symbols:check-circle-outline" className="size-6" />
				:	<LockIcon />,
		},
		{
			body:
				isAllModulesCompleted ?
					`Module ${completedModulesCount}`
				:	`Module ${completedModulesCount + 2}`,
			button: null,
			id: 3,
			isSub: true,
			title:
				isAllModulesCompleted ?
					<IconBox icon="material-symbols:check-circle-outline" className="size-6" />
				:	<LockIcon />,
		},
		{
			body: isAllModulesCompleted ? "You can take the exam any time" : "Complete module 10 to activate",
			button: (
				<Button
					theme="orange"
					disabled={!isAllModulesCompleted}
					className="max-w-[150px] self-end"
					onClick={() => router.push("/dashboard/exam")}
				>
					Take Exam
				</Button>
			),
			id: 4,
			isSub: false,
			title: "Exam",
		},
		{
			body: "A certificate of completion can be obtained if you pass the minimum mark of 80% in the exam",
			button: (
				<Button
					theme="orange"
					disabled={!sessionQueryResult.data?.is_certified}
					isLoading={downloadCertificateMutationResult.isPending}
					isDisabled={downloadCertificateMutationResult.isPending}
					className={cnMerge("max-w-[150px] self-end")}
					onClick={() => downloadCertificateMutationResult.mutate({ id: certificateId })}
				>
					Download certificate
				</Button>
			),
			id: 5,
			isSub: false,
			title: "Certificate",
		},
	];

	if (!dashboardQueryResult.data) {
		return <LoadingScreen text="Loading dashboard..." />;
	}

	return (
		<Main className="flex-row">
			<DashboardSideBar />

			<div className="flex flex-col gap-8 bg-white px-3 pt-[80px]">
				<section className="flex flex-col gap-5">
					<article className="flex items-center justify-between">
						<div className="flex flex-col gap-1">
							<p className="text-[28px] font-semibold text-cyberaware-aeces-blue">
								Hello, {sessionQueryResult.data?.first_name}!
							</p>
							<p className="text-[14px]">
								{completedModulesCount === 10 ?
									"You’ve completed all modules!"
								:	`You’re on Module ${completedModulesCount} of ${dashboardQueryResult.data.total_modules}`
								}
							</p>
						</div>

						<UserAvatar />
					</article>

					<article className="flex flex-col gap-3">
						<ProgressAnimated.Root
							value={dashboardQueryResult.data.percentage_completed}
							classNames={{
								base: "h-3 rounded-[20px] bg-[hsl(0,0%,85%)]",
								indicator: "rounded-[20px] bg-cyberaware-unizik-orange",
							}}
						/>
						<p className="text-cyberaware-aeces-blue">
							{dashboardQueryResult.data.percentage_completed}% complete
						</p>
					</article>
				</section>

				<section className="grid w-full gap-x-3 gap-y-3.5">
					{cardDetails.map((detail) => (
						<div
							key={detail.id}
							className={cnJoin(
								"flex flex-col gap-5 bg-cyberaware-neutral-gray-lighter px-5 py-6",
								detail.isSub ? "col-span-1" : "col-span-2"
							)}
						>
							<div
								className={cnJoin(
									"flex flex-col",
									detail.isSub ? "items-center gap-3.5" : "gap-2"
								)}
							>
								<h4 className="text-[22px] font-semibold text-cyberaware-aeces-blue">
									{detail.title}
								</h4>
								<p
									className={cnJoin(
										detail.isSub ?
											"text-[22px] font-semibold wrap-anywhere text-cyberaware-aeces-blue"
										:	"text-[10px]"
									)}
								>
									{detail.body}
								</p>
							</div>

							{detail.button}
						</div>
					))}
				</section>

				<footer className="flex items-center gap-4 pb-6 text-[10px]">
					<Credits />
				</footer>
			</div>
		</Main>
	);
}

export default withProtection(DashboardPage);
