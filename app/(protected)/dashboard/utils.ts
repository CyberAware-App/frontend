import type { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { callBackendApi } from "@/lib/api/callBackendApi";
import { authTokenObject } from "@/lib/api/callBackendApi/plugins/utils";
import { dashboardQuery, sessionQuery } from "@/lib/react-query/queryOptions";
import type { AppRouterInstance } from "@bprogress/next";

export const logout = (queryClient: QueryClient, router: AppRouterInstance) => {
	const refreshToken = authTokenObject.getRefreshToken();

	if (!refreshToken) {
		toast.error("No session found!");
		return;
	}

	void callBackendApi("@post/logout", {
		body: { refresh: refreshToken },

		onSuccess: () => {
			router.push("/");
			queryClient.removeQueries(sessionQuery());
			queryClient.removeQueries(dashboardQuery());
			authTokenObject.clearTokens();
		},
	});
};
