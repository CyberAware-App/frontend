import { createFetchClient, type BaseCallApiConfig } from "@zayne-labs/callapi";
import { defineBaseConfig } from "@zayne-labs/callapi/utils";
import { apiSchema } from "./apiSchema";
import { authPlugin, toastPlugin, type AuthPluginMeta, type ToastPluginMeta } from "./plugins";
import { isAuthTokenRelatedError } from "./plugins/utils";

type GlobalMeta = AuthPluginMeta & ToastPluginMeta;

declare module "@zayne-labs/callapi" {
	// eslint-disable-next-line ts-eslint/consistent-type-definitions
	interface Register {
		meta: GlobalMeta;
	}
}

const REMOTE_BACKEND_HOST = "https://hon-agnella-cyberaware-ecca99d6.koyeb.app";

// const BACKEND_HOST =
// 	process.env.NODE_ENV === "development" ? "http://127.0.0.1:8000" : REMOTE_BACKEND_HOST;

const BACKEND_HOST = REMOTE_BACKEND_HOST;

const BASE_API_URL = `${BACKEND_HOST}/api`;

const sharedBaseConfig = defineBaseConfig((instanceCtx) => ({
	baseURL: BASE_API_URL,

	dedupeCacheScope: "global",
	dedupeCacheScopeKey: instanceCtx.options.baseURL,

	plugins: [authPlugin(), toastPlugin()],
	schema: apiSchema,

	skipAutoMergeFor: "options",

	...(instanceCtx.options as object),

	meta: {
		...instanceCtx.options.meta,

		auth: {
			// routesToExemptFromHeaderAddition: ["/auth/**"],
			routesToExemptFromRedirectOnAuthError: ["/", "/auth/**"],
			signInRoute: "/auth/signin",
			// navigateFn: redirectTo,
			...instanceCtx.options.meta?.auth,
		},

		toast: {
			endpointsToSkip: {
				errorAndSuccess: ["/token-refresh"],
				success: ["/session"],
			},
			errorAndSuccess: true,
			errorsToSkip: ["AbortError"],
			errorsToSkipCondition: (error) => isAuthTokenRelatedError(error),
			...instanceCtx.options.meta?.toast,
		},
	} satisfies GlobalMeta,
}));

export const callBackendApi = createFetchClient(sharedBaseConfig);

export const callBackendApiForQuery = createFetchClient(
	(instanceCtx) =>
		({
			...sharedBaseConfig(instanceCtx),
			resultMode: "onlyData",
			throwOnError: true,
		}) satisfies BaseCallApiConfig
);
