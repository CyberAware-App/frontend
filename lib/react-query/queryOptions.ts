import type { AppRouterInstance } from "@bprogress/next";
import { queryOptions } from "@tanstack/react-query";
import type { CallApiExtraOptions } from "@zayne-labs/callapi";
import { toast } from "sonner";
import { callBackendApiForQuery } from "../api/callBackendApi";
import { checkUserSession } from "../api/callBackendApi/plugins/utils/session";
import { getUserAvatar } from "../utils/common";

export const sessionQuery = () => {
	return queryOptions({
		queryFn: () => checkUserSession(),
		queryKey: ["session"],
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
		queryFn: () => {
			return callBackendApiForQuery("@get/dashboard", {
				dedupeStrategy: "defer",
				meta: { toast: { success: false } },
			});
		},
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

export const moduleQuizQuery = (options?: {
	moduleId: string;
	router: AppRouterInstance;
	isUnaccessible: boolean | undefined;
}) => {
	const { moduleId = "", router, isUnaccessible } = options ?? {};

	return queryOptions({
		queryFn: () => {
			if (isUnaccessible) {
				const message = "You are not authorized to access this module";
				toast.error(message);
				router?.push("/dashboard");
				throw new Error(message);
			}

			return callBackendApiForQuery("@get/module/:id/quiz", {
				params: { id: moduleId },
				meta: { toast: { success: false } },
			});
		},
		select: (data) => data.data,
		queryKey: ["module-quiz", moduleId, { isUnaccessible }],
		staleTime: Infinity,
	});
};

export type SelectedQuizQuestions = Awaited<
	ReturnType<NonNullable<ReturnType<typeof moduleQuizQuery>["select"]>>
>;

export const examQuery = (options?: {
	router: AppRouterInstance;
	isCertified: boolean | undefined;
	isUnaccessible: boolean | undefined;
}) => {
	const { router, isCertified, isUnaccessible } = options ?? {};

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

				onRequest: () => {},

				onResponseError: (ctx) => {
					const isMaximumError = ctx.response.status === 400 && ctx.error.message.includes("maximum");

					if (isMaximumError) {
						router?.push("/dashboard");
					}
				},
			});
		},
		select: (data) => data.data,
		queryKey: ["exam", { isCertified, isUnaccessible }],
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
		select: (data) => data.data,
		queryKey: ["certificate"],
		staleTime: Infinity,
	});
};

const forceDownload = (data: Blob, id: string) => {
	const blobUrl = window.URL.createObjectURL(data);

	const link = document.createElement("a");
	link.href = blobUrl;
	link.download = `certificate-${id}.pdf`;
	link.click();

	window.URL.revokeObjectURL(blobUrl);
};

export const downloadCertificateQuery = (
	options: { id: string | undefined; enabled: boolean } & Pick<CallApiExtraOptions, "onResponse">
) => {
	const { id = "", enabled, onResponse } = options;

	return queryOptions({
		queryFn: () => {
			return callBackendApiForQuery("@get/certificate/:id/download", {
				params: { id },
				meta: { toast: { success: false } },
				responseType: "blob",
				onResponse,
				onSuccess: (ctx) => forceDownload(ctx.data, id),
			});
		},
		enabled,
		queryKey: ["certificate", "download", id, enabled, onResponse],
		staleTime: Infinity,
	});
};
