import { isHTTPError } from "@zayne-labs/callapi/utils";
import { callBackendApi, callBackendApiForQuery } from "../../callBackendApi";
import { refreshUserSession } from "./refreshUserSession";

const checkAndRefreshUserSession = async () => {
	const result = await callBackendApi("/session", { dedupeStrategy: "defer" });

	if (result.data) {
		return result.data;
	}

	if (isHTTPError(result.error)) {
		await refreshUserSession();

		return callBackendApiForQuery("/session");
	}

	throw result.error.originalError;
};

export { checkAndRefreshUserSession };
