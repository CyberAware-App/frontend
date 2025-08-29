import type { AppRouterInstance } from "@bprogress/next";
import { callBackendApi } from "@/lib/api/callBackendApi";
import { authTokenObject } from "@/lib/api/callBackendApi/plugins/utils";

export const logout = (router: AppRouterInstance) => {
	const refreshToken = authTokenObject.refreshToken();

	if (!refreshToken) return;

	void callBackendApi("@post/logout", {
		body: { refresh: refreshToken },

		onSuccess: () => {
			authTokenObject.clearTokens();

			router.push("/");
		},
	});
};
