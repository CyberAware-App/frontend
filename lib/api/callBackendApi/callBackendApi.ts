import { createFetchClient } from "@zayne-labs/callapi";
import {
	type AuthHeaderInclusionPluginMeta,
	isAuthTokenRelatedError,
	type ToastPluginMeta,
	toastPlugin,
} from "./plugins";
import { apiSchema } from "./schema";

type GlobalMeta = AuthHeaderInclusionPluginMeta & ToastPluginMeta;

declare module "@zayne-labs/callapi" {
	// eslint-disable-next-line ts-eslint/consistent-type-definitions
	interface Register {
		meta: GlobalMeta;
	}
}

const BACKEND_HOST = "https://cyberaware-api-mx7u.onrender.com";

const BASE_API_URL = `${BACKEND_HOST}/api`;

const sharedBaseCallApiConfig = ((instanceCtx) => ({
	baseURL: BASE_API_URL,
	dedupeCacheScope: "global",
	dedupeCacheScopeKey: BASE_API_URL,
	plugins: [toastPlugin()],
	schema: apiSchema,

	skipAutoMergeFor: "options",

	...(instanceCtx.options as object),

	meta: {
		...instanceCtx.options.meta,
		toast: {
			endpointsToSkip: {
				errorAndSuccess: ["/token-refresh"],
				success: ["/session"],
			},
			error: true,
			errorsToSkip: ["AbortError"],
			errorsToSkipCondition: (error) => isAuthTokenRelatedError(error),
			success: true,
			...instanceCtx.options.meta?.toast,
		},
	},
})) satisfies Parameters<typeof createFetchClient>[0];

export const callBackendApi = createFetchClient(sharedBaseCallApiConfig);

export const callBackendApiForQuery = createFetchClient((instanceCtx) => ({
	...sharedBaseCallApiConfig(instanceCtx),
	resultMode: "onlySuccessWithException",
	throwOnError: true,
}));
