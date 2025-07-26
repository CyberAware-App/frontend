import { createFetchClient, defineBaseConfig } from "@zayne-labs/callapi";
import { backendApiSchema } from "./apiSchema";
import {
	type AuthHeaderInclusionPluginMeta,
	isAuthTokenRelatedError,
	type ToastPluginMeta,
	toastPlugin,
} from "./plugins";

type GlobalMeta = AuthHeaderInclusionPluginMeta & ToastPluginMeta;

declare module "@zayne-labs/callapi" {
	// eslint-disable-next-line ts-eslint/consistent-type-definitions
	interface Register {
		meta: GlobalMeta;
	}
}

const BACKEND_HOST =
	process.env.NODE_ENV === "development" ?
		"http://127.0.0.1:8000"
	:	"https://cyberaware-api-mx7u.onrender.com";

const BASE_API_URL = `${BACKEND_HOST}/api`;

const sharedBaseCallApiConfig = defineBaseConfig((instanceCtx) => ({
	baseURL: BASE_API_URL,
	dedupeCacheScope: "global",
	dedupeCacheScopeKey: BASE_API_URL,
	plugins: [toastPlugin()],
	schema: backendApiSchema,

	skipAutoMergeFor: "options",

	...(instanceCtx.options as object),

	meta: {
		...instanceCtx.options.meta,
		toast: {
			endpointsToSkip: { errorAndSuccess: ["/token-refresh"], success: ["/session"] },
			error: true,
			errorsToSkip: ["AbortError"],
			errorsToSkipCondition: (error) => isAuthTokenRelatedError(error),
			success: true,
			...instanceCtx.options.meta?.toast,
		},
	},
}));

export const callBackendApi = createFetchClient(sharedBaseCallApiConfig);

export const callBackendApiForQuery = createFetchClient((instanceCtx) => ({
	...sharedBaseCallApiConfig(instanceCtx),
	resultMode: "onlySuccessWithException",
	throwOnError: true,
}));
