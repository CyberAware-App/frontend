import type { QueryClient } from "@tanstack/react-query";
import { hardNavigate } from "@zayne-labs/toolkit-core";
import { toast } from "sonner";
import { callBackendApi } from "@/lib/api/callBackendApi";
import { authTokenObject } from "@/lib/api/callBackendApi/plugins/utils";
import { dashboardQuery, sessionQuery } from "@/lib/react-query/queryOptions";

export const logout = (queryClient: QueryClient) => {
	const refreshToken = authTokenObject.refreshToken();

	if (!refreshToken) {
		toast.error("No session found!");
		return;
	}

	void callBackendApi("@post/logout", {
		body: { refresh: refreshToken },

		onSuccess: () => {
			queryClient.removeQueries(sessionQuery());
			queryClient.removeQueries(dashboardQuery());
			authTokenObject.clearTokens();
			hardNavigate("/");
		},
	});
};
