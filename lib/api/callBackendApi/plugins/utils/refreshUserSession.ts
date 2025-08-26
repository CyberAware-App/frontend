import { isHTTPError } from "@zayne-labs/callapi/utils";
import { callBackendApi } from "../../callBackendApi";
import { authTokenObject, redirectAndThrow } from "./common";

const refreshUserSession = async () => {
	const refreshToken = authTokenObject.refreshToken();

	if (!refreshToken) {
		return redirectAndThrow();
	}

	const { data, error } = await callBackendApi("@post/token-refresh", {
		body: { refresh: refreshToken },
		dedupeStrategy: "defer",
		meta: { auth: { skipHeaderAddition: true } },
	});

	if (isHTTPError(error)) {
		return redirectAndThrow("Session invalid or expired! Redirecting to login...");
	}

	data?.data && localStorage.setItem("accessToken", data.data.access);

	return null;
};

export { refreshUserSession };
