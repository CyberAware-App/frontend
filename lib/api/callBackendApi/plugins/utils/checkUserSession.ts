import { callBackendApiForQuery } from "../../callBackendApi";

const checkUserSession = () => {
	return callBackendApiForQuery("@get/session", { dedupeStrategy: "defer" });
};

export { checkUserSession };
