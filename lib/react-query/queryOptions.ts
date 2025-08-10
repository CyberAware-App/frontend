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

export const dashboardQuery = () => {
	return queryOptions({
		queryFn: () => callBackendApiForQuery("/dashboard", { meta: { toast: { success: false } } }),
		queryKey: ["dashboard"],
		staleTime: Infinity,
	});
};
