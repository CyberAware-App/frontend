import { callBackendApiForQuery } from "../../callBackendApi";

const checkAndRefreshUserSession = () => {
	return callBackendApiForQuery("@get/session", { dedupeStrategy: "defer" });
};

export { checkAndRefreshUserSession };
