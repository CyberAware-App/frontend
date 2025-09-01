import { callBackendApi, callBackendApiForQuery } from "../../callBackendApi";

export const checkUserSession = () => {
	return callBackendApiForQuery("@get/session", { dedupeStrategy: "defer" });
};

export const getNewUserSession = (refreshToken: string) => {
	return callBackendApi("@post/token-refresh", {
		body: { refresh: refreshToken },
		dedupeStrategy: "defer",
		meta: { auth: { skipHeaderAddition: true } },
	});
};
