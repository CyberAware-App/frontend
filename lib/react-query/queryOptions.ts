import { queryOptions } from "@tanstack/react-query";
import { callBackendApiForQuery } from "../api/callBackendApi";
import { checkAndRefreshUserSession } from "../api/callBackendApi/plugins/utils";

export const sessionQuery = () => {
	return queryOptions({
		queryFn: () => checkAndRefreshUserSession(),
		queryKey: ["session"],
		refetchInterval: 9 * 60 * 1000, // 9 minutes
		retry: false,
		staleTime: Infinity,
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
