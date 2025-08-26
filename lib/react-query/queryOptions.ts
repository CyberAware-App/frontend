import type { AppRouterInstance } from "@bprogress/next";
import { queryOptions } from "@tanstack/react-query";
import { callBackendApiForQuery } from "../api/callBackendApi";
import { checkAndRefreshUserSession } from "../api/callBackendApi/plugins/utils";
import { getUserAvatar } from "../utils/common";

export const sessionQuery = () => {
	return queryOptions({
		queryFn: () => checkAndRefreshUserSession(),
		queryKey: ["session"],
		refetchInterval: 9 * 60 * 1000, // 9 minutes
		retry: false,
		staleTime: Infinity,
		select: (data) => ({
			...data.data,
			avatar: getUserAvatar(data.data.first_name, data.data.last_name),
		}),
	});
};

type ModuleStatus = "complete" | "ongoing" | "locked";

const computeModuleStatus = (moduleId: number, completedModules: number | undefined = 0): ModuleStatus => {
	if (moduleId === completedModules + 1) {
		return "ongoing";
	}

	if (moduleId > completedModules + 1) {
		return "locked";
	}

	return "complete";
};

export const dashboardQuery = () => {
	return queryOptions({
		queryFn: () => callBackendApiForQuery("@get/dashboard", { meta: { toast: { success: false } } }),
		select: (data) => ({
			...data.data,
			completed_modules_count:
				data.data.completed_modules === 10 ?
					data.data.completed_modules
				:	data.data.completed_modules + 1,
			modules: data.data.modules.map((module) => ({
				...module,
				title: `Module ${module.id}`,
				status: computeModuleStatus(module.id, data.data.completed_modules),
			})),
		}),
		queryKey: ["dashboard"],
		staleTime: Infinity,
	});
};

export type SelectedModule = Awaited<
	ReturnType<NonNullable<ReturnType<typeof dashboardQuery>["select"]>>
>["modules"][number];

export const moduleQuizQuery = (moduleId: string) => {
	return queryOptions({
		queryFn: () =>
			callBackendApiForQuery("@get/module/:id/quiz", {
				params: { id: moduleId },
				meta: { toast: { success: false } },
			}),
		queryKey: ["module-quiz", moduleId],
		staleTime: Infinity,
	});
};

export type SelectedQuizQuestions = Awaited<
	ReturnType<NonNullable<ReturnType<typeof moduleQuizQuery>["select"]>>
>["data"];

export const examQuery = (router: AppRouterInstance) => {
	return queryOptions({
		queryFn: () =>
			callBackendApiForQuery("@get/quiz", {
				meta: { toast: { success: false } },
				onResponseError: (ctx) => {
					const isMaximumError = ctx.response.status === 400 && ctx.error.message.includes("maximum");

					if (isMaximumError) {
						router.push("/dashboard");
					}
				},
			}),
		queryKey: ["exam"],
		staleTime: Infinity,
	});
};

export type SelectedExamQuestions = Awaited<
	ReturnType<NonNullable<ReturnType<typeof examQuery>["select"]>>
>["data"];
