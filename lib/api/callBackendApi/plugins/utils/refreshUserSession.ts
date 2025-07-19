import { isHTTPError } from "@zayne-labs/callapi/utils";
import { hardNavigate } from "@zayne-labs/toolkit-core";
import { toast } from "sonner";
import { callBackendApi } from "../../callBackendApi";

const refreshUserSession = async () => {
	const refreshToken = localStorage.getItem("refreshToken");

	if (!refreshToken) {
		const message = "Session is missing! Redirecting to login...";

		toast.error(message);

		setTimeout(() => hardNavigate("/signin"), 1500);

		throw new Error(message);
	}

	const result = await callBackendApi("/token-refresh", {
		body: { refresh: refreshToken },
		method: "POST",
	});

	if (isHTTPError(result.error)) {
		const message = "Session invalid or expired! Redirecting to login...";

		toast.error(message);

		setTimeout(() => hardNavigate("/signin"), 1500);

		throw new Error(message);
	}

	result.data?.data && localStorage.setItem("accessToken", result.data.data.access);
};

export { refreshUserSession };
