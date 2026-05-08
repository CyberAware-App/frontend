import { defineInstanceConfig } from "@zayne-labs/callapi/utils";
import { callBackendApi, callBackendApiForQuery } from "../../callBackendApi";

const sessionDedupeOptions = defineInstanceConfig({
	dedupeKey: (ctx) => ctx.options.initURL,
	dedupeStrategy: "defer",
});

export const checkUserSessionForQuery = () => {
	return callBackendApiForQuery("@get/session", {
		...sessionDedupeOptions,
		meta: { toast: { success: false } },
	});
};

export const checkUserSession = () =>
	callBackendApi("@get/session", {
		...sessionDedupeOptions,
		meta: { toast: { success: false } },
	});

export const getNewUserSession = (refreshToken: string) => {
	return callBackendApi("@post/token-refresh", {
		...sessionDedupeOptions,
		body: { refresh: refreshToken },
		meta: { auth: { skipHeaderAddition: true } },
	});
};
