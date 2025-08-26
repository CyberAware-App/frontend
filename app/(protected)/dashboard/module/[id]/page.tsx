"use client";

import { useRouter } from "@bprogress/next";
import MuxPlayer from "@mux/mux-player-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import { ProtectedMain } from "@/app/-components";
import { AuthLoader } from "@/app/(protected)/-components/AuthLoader";
import { IconBox } from "@/components/common/IconBox";
import { NavLink } from "@/components/common/NavLink";
import { Button } from "@/components/ui/button";
import { callBackendApi } from "@/lib/api/callBackendApi";
import { dashboardQuery } from "@/lib/react-query/queryOptions";
import { Heading } from "../../Heading";
import { FootNote } from "../FootNote";

function ModulePage({ params }: PageProps<"/dashboard/module/[id]">) {
	const dashboardQueryResult = useQuery(dashboardQuery());

	const { id: moduleId } = use(params);

	const selectedModule = dashboardQueryResult.data?.modules.find(
		(module) => String(module.id) === moduleId
	);

	const [isModuleMarkedAsCompleted, setIsModuleMarkedAsCompleted] = useState(false);

	const router = useRouter();

	const queryClient = useQueryClient();

	const isModuleLocked = selectedModule && selectedModule.status === "locked";

	const isFinalModule = selectedModule?.id === 10;

	useEffect(() => {
		if (isModuleLocked) {
			toast.error("You are not authorized to access this module");

			router.push("/dashboard");
		}
	}, [isModuleLocked, router]);

	if (!selectedModule || isModuleLocked) {
		return <AuthLoader text="Loading module..." />;
	}

	return (
		<ProtectedMain>
			<Heading />

			<section className="flex grow flex-col gap-[50px] bg-white px-5 pt-5 pb-[50px]">
				<hr className="h-px w-full border-none bg-cyberaware-neutral-gray-light" />

				<article className="flex flex-col gap-10">
					<h3 className="text-[28px] font-semibold text-cyberaware-aeces-blue">
						{selectedModule.title}: {selectedModule.name}
					</h3>

					<MuxPlayer
						className="aspect-[398/190]
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
				</article>

				<article className="mt-5 flex flex-col gap-6">
					<h4 className="text-[22px] font-semibold text-cyberaware-aeces-blue">
						Let’s Test Your Knowledge
					</h4>

					<Button
						theme="orange"
						disabled={selectedModule.status !== "complete"}
						className="max-w-[160px] gap-2.5"
						asChild={true}
					>
						<NavLink href={isFinalModule ? "/dashboard/exam" : `/dashboard/module/${moduleId}/quiz`}>
							Take {isFinalModule ? "Exam" : "Quiz"}
							<IconBox icon="ri:brain-2-line" className="size-5" />
						</NavLink>
					</Button>

					<FootNote selectedModule={selectedModule} />
				</article>
			</section>
		</ProtectedMain>
	);
}

export default ModulePage;
