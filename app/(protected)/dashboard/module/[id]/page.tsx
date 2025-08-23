"use client";

import MuxPlayer from "@mux/mux-player-react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import { ProtectedMain } from "@/app/-components";
import { IconBox } from "@/components/common/IconBox";
import { NavLink } from "@/components/common/NavLink";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress-animated";
import { callBackendApi } from "@/lib/api/callBackendApi";
import { dashboardQuery } from "@/lib/react-query/queryOptions";
import { Afam, logoSmall } from "@/public/assets";

// import "@mux/mux-player-react/themes/classic";

function ModulePage({ params }: PageProps<"/dashboard/module/[id]">) {
	const dashboardQueryResult = useQuery(dashboardQuery());

	const { id: moduleId } = use(params);

	const moduleResult = dashboardQueryResult.data?.modules.find(
		(module) => module.id === Number(moduleId)
	);

	const router = useRouter();

	const [isModuleMarkedAsCompleted, setIsModuleMarkedAsCompleted] = useState(false);

	const handleModuleCompletion = (event: Event) => {
		const element = event.target as HTMLMediaElement;
		const completionPercentage = Math.trunc((element.currentTime / element.duration) * 100);

		const shouldMarkModuleAsComplete = completionPercentage >= 80 && !isModuleMarkedAsCompleted;

		if (!shouldMarkModuleAsComplete) return;

		void callBackendApi("@post/module/:id/complete", { params: { id: moduleId } });

		setIsModuleMarkedAsCompleted(true);
	};

	useEffect(() => {
		if (moduleResult?.status === "locked") {
			toast.error("You are not authorized to access this module");

			router.push("/dashboard");
		}
	}, [moduleResult, router]);

	if (moduleResult?.status === "locked") {
		return null;
	}

	return (
		<ProtectedMain>
			<section className="px-4 pt-[50px] pb-8">
				<NavLink
					href="/dashboard"
					className="flex items-center gap-1 text-[12px] text-cyberaware-unizik-orange"
				>
					<IconBox icon="ri:arrow-left-line" className="size-4" />
					Back to dashboard
				</NavLink>

				<article className="mt-4 flex items-center justify-between gap-5">
					<div className="flex items-center">
						<Image src={logoSmall} alt="Logo" className="max-w-10" />
						<h3
							className="w-0 text-[22px] font-medium text-white in-data-[state=collapsed]:opacity-0"
						>
							CyberAware
						</h3>
					</div>

					<Image
						src={Afam}
						alt="user"
						className="size-[50px] rounded-full border-[2px] border-solid
							border-cyberaware-unizik-orange"
					/>
				</article>

				<article className="mt-5.5 flex items-center gap-4">
					<p className="shrink-0 text-[18px] font-semibold text-cyberaware-neutral-gray-light">
						{moduleResult?.title} of {dashboardQueryResult.data?.total_modules}
					</p>

					<Progress
						value={dashboardQueryResult.data?.percentage_completed}
						classNames={{
							base: "h-3 rounded-[20px] bg-[hsl(0,0%,85%)]",
							indicator: "rounded-[20px] bg-cyberaware-unizik-orange",
						}}
					/>
				</article>
			</section>
			<section className="flex grow flex-col gap-[50px] bg-white px-5 pt-5 pb-[50px]">
				<hr className="h-px w-full border-none bg-cyberaware-neutral-gray-light" />

				<article className="flex flex-col gap-10">
					<h3 className="text-[28px] font-semibold text-cyberaware-aeces-blue">
						{moduleResult?.title}: {moduleResult?.name}
					</h3>

					<MuxPlayer
						// theme="classic"
						onTimeUpdate={handleModuleCompletion}
						className="aspect-[398/190]
							shadow-[0px_5px_20px_0px_var(--color-cyberaware-unizik-orange)]"
						primaryColor="var(--color-cyberaware-light-orange)"
						playbackId={moduleResult?.mux_playback}
					/>
				</article>

				<article className="mt-5 flex flex-col gap-6">
					<h4 className="text-[22px] font-semibold text-cyberaware-aeces-blue">
						Let’s Test Your Knowledge
					</h4>

					<Button theme="orange" className="max-w-[160px] gap-2.5">
						Take Quiz
						<IconBox icon="ri:brain-2-line" className="size-5" />
					</Button>

					<p className="text-[12px] font-medium text-cyberaware-aeces-blue">
						Your progress is saved automatically. You’ll unlock Day 2 after completing this quiz.
					</p>
				</article>
			</section>
		</ProtectedMain>
	);
}

export default ModulePage;
