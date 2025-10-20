import type { AppRouterInstance } from "@bprogress/next";
import { queryOptions } from "@tanstack/react-query";
import { toast } from "sonner";
import { callBackendApiForQuery } from "../api/callBackendApi";
import { checkUserSessionForQuery } from "../api/callBackendApi/plugins/utils/session";
import { getUserAvatar } from "../utils/common";

export const sessionQuery = () => {
	return queryOptions({
		queryFn: () => checkUserSessionForQuery(),
		queryKey: ["session"],
		retry: false,
		select: (data) => ({
			...data.data,
			avatar: getUserAvatar(data.data.first_name, data.data.last_name),
		}),
		staleTime: Infinity,
	});
};

type ModuleStatus = "complete" | "locked" | "ongoing";

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
		queryFn: () => {
			return callBackendApiForQuery("@get/dashboard", {
				dedupeStrategy: "defer",
				meta: { toast: { success: false } },
			});
		},
		queryKey: ["dashboard"],
		select: (data) => ({
			...data.data,
			completed_modules_count:
				data.data.completed_modules === 10 ?
					data.data.completed_modules
				:	data.data.completed_modules + 1,
			modules: data.data.modules.map((module) => ({
				...module,
				status: computeModuleStatus(module.id, data.data.completed_modules),
				title: `Module ${module.id}`,
			})),
		}),
		staleTime: Infinity,
	});
};

export type SelectedModule = Awaited<
	ReturnType<NonNullable<ReturnType<typeof dashboardQuery>["select"]>>
>["modules"][number];

export const moduleQuizQuery = (options?: {
	isUnaccessible: boolean | undefined;
	moduleId: string;
	router: AppRouterInstance;
}) => {
	const { isUnaccessible, moduleId = "", router } = options ?? {};

	return queryOptions({
		queryFn: () => {
			if (isUnaccessible) {
				const message = "You are not authorized to access this module";
				toast.error(message);
				router?.push("/dashboard");
				throw new Error(message);
			}

			return callBackendApiForQuery("@get/module/:id/quiz", {
				meta: { toast: { success: false } },
				params: { id: moduleId },
			});
		},
		queryKey: ["module-quiz", moduleId, { isUnaccessible }],
		select: (data) => data.data,
		staleTime: Infinity,
	});
};

export type SelectedQuizQuestions = Awaited<
	ReturnType<NonNullable<ReturnType<typeof moduleQuizQuery>["select"]>>
>;

export const examQuery = (options?: {
	isCertified: boolean | undefined;
	isUnaccessible: boolean | undefined;
	router: AppRouterInstance;
}) => {
	const { isCertified, isUnaccessible, router } = options ?? {};

	return queryOptions({
		queryFn: () => {
			if (isCertified) {
				const message = "You have already been certified!";
				throw new Error(message);
			}

			if (isUnaccessible) {
				const message = "You are not authorized to access this exam!";
				toast.error(message);
				router?.push("/dashboard");
				throw new Error(message);
			}

			return callBackendApiForQuery("@get/quiz", {
				meta: { toast: { success: false } },

				onResponseError: (ctx) => {
					const isMaximumError = ctx.response.status === 400 && ctx.error.message.includes("maximum");

					if (isMaximumError) {
						router?.push("/dashboard");
					}
				},
			});
		},
		queryKey: ["exam", { isCertified, isUnaccessible }],
		select: (data) => data.data,
		staleTime: Infinity,
	});
};

export type SelectedExamDetails = Awaited<ReturnType<NonNullable<ReturnType<typeof examQuery>["select"]>>>;

export const certificateQuery = () => {
	return queryOptions({
		queryFn: () => {
			return callBackendApiForQuery("@get/certificate", {
				meta: { toast: { errorAndSuccess: false } },
			});
		},
		queryKey: ["certificate"],
		select: (data) => data.data,
		staleTime: Infinity,
	});
};
