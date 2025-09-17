import type { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { callBackendApi } from "@/lib/api/callBackendApi";
import { authTokenObject, redirectTo } from "@/lib/api/callBackendApi/plugins/utils";
import { dashboardQuery, sessionQuery } from "@/lib/react-query/queryOptions";

export const logout = (queryClient: QueryClient) => {
	const refreshToken = authTokenObject.getRefreshToken();

	if (!refreshToken) {
		toast.error("No session found!");
		return;
	}

	void callBackendApi("@post/logout", {
		body: { refresh: refreshToken },

		onSuccess: () => {
			redirectTo("/");
			queryClient.removeQueries(sessionQuery());
			queryClient.removeQueries(dashboardQuery());
			authTokenObject.clearTokens();
		},
	});
};
