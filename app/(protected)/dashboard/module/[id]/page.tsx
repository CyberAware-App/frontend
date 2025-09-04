"use client";

import MuxPlayer from "@mux/mux-player-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { use, useState } from "react";
import { Main } from "@/app/-components";
import { LoadingScreen } from "@/app/-components/LoadingScreen";
import { withProtection } from "@/app/(protected)/-components/withProtection";
import { IconBox } from "@/components/common/IconBox";
import { Button } from "@/components/ui/button";
import { callBackendApi } from "@/lib/api/callBackendApi";
import { usePageBlocker } from "@/lib/hooks";
import { dashboardQuery } from "@/lib/react-query/queryOptions";
import { DashboardHeading } from "../../DashboardHeading";
import { FootNote } from "../FootNote";
import { useRouter } from "@bprogress/next";

function ModulePage({ params }: PageProps<"/dashboard/module/[id]">) {
	const dashboardQueryResult = useQuery(dashboardQuery());

	const { id: moduleId } = use(params);

	const selectedModule = dashboardQueryResult.data?.modules.find(
		(module) => String(module.id) === moduleId
	);

	const router = useRouter();

	const [isModuleMarkedAsCompleted, setIsModuleMarkedAsCompleted] = useState(false);

	const queryClient = useQueryClient();

	const isModuleUnaccessible = Boolean(selectedModule) && selectedModule.status === "locked";

	const isFinalModule = selectedModule?.id === 10;

	usePageBlocker({
		condition: isModuleUnaccessible,
		message: "Module not found",
		redirectPath: "/dashboard",
	});

	if (!selectedModule || isModuleUnaccessible) {
		return <LoadingScreen text="Loading module..." />;
	}

	return (
		<Main>
			<DashboardHeading />

			<section className="flex grow flex-col gap-[50px] bg-white px-5 pt-5 pb-[50px]">
				<hr className="h-px w-full border-none bg-cyberaware-neutral-gray-light" />

				<article className="flex flex-col gap-10">
					<h3 className="text-[28px] font-semibold text-cyberaware-aeces-blue">
						{selectedModule.title}: {selectedModule.name}
					</h3>

					<div className="flex items-center justify-center">
						<MuxPlayer
							className="h-[190px] w-full max-w-[398px]
								shadow-[0px_5px_20px_0px_var(--color-cyberaware-unizik-orange)]"
							primaryColor="var(--color-cyberaware-light-orange)"
							playbackId={selectedModule.mux_playback}
							onTimeUpdate={(event) => {
								const element = event.target as HTMLMediaElement;

								const completionPercentage = Math.trunc(
									(element.currentTime / element.duration) * 100
								);

								const shouldMarkModuleAsComplete =
									selectedModule.status !== "complete"
									&& completionPercentage >= 80
									&& !isModuleMarkedAsCompleted;

								if (!shouldMarkModuleAsComplete) return;

								setIsModuleMarkedAsCompleted(true);

								void callBackendApi("@post/module/:id/complete", {
									params: { id: moduleId },
									onSuccess: () => queryClient.refetchQueries(dashboardQuery()),
								});
							}}
						/>
					</div>
				</article>

				<article className="mt-5 flex flex-col gap-6">
					<h4 className="text-[22px] font-semibold text-cyberaware-aeces-blue">
						Let’s Test Your Knowledge
					</h4>

					<Button
						theme="orange"
						disabled={selectedModule.status !== "complete"}
						onClick={() =>
							router.push(isFinalModule ? "/dashboard/exam" : `/dashboard/module/${moduleId}/quiz`)
						}
						className="max-w-[160px] gap-2.5"
					>
						Take {isFinalModule ? "Exam" : "Quiz"}
						<IconBox icon="ri:brain-2-line" className="size-5" />
					</Button>

					<FootNote selectedModule={selectedModule} />
				</article>
			</section>
		</Main>
	);
}

export default withProtection(ModulePage);
