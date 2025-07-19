import { isHTTPError } from "@zayne-labs/callapi/utils";
import { callBackendApi, callBackendApiForQuery } from "../../callBackendApi";
import { refreshUserSession } from "./refreshUserSession";

const checkUserSession = async () => {
	const result = await callBackendApi("/check-user-session", {
		dedupeStrategy: "defer",
	});

	if (result.data) {
		return result.data;
	}

	if (isHTTPError(result.error)) {
		await refreshUserSession();

		return callBackendApiForQuery("/check-user-session");
	}

	if (!result.error) return;

	throw result.error.originalError;
};

export { checkUserSession };
