import type { AppRouterInstance } from "@bprogress/next";
import type { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { callBackendApi } from "@/lib/api/callBackendApi";
import { authTokenStore } from "@/lib/api/callBackendApi/plugins/utils";
import { dashboardQuery, sessionQuery } from "@/lib/react-query/queryOptions";

export const logout = (queryClient: QueryClient, router: AppRouterInstance) => {
	const refreshToken = authTokenStore.getRefreshToken();

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
			authTokenStore.clearTokens();
		},
	});
};
