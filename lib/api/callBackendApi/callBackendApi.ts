import { createFetchClientWithContext } from "@zayne-labs/callapi";
import { loggerPlugin } from "@zayne-labs/callapi-plugins";
import { defineBaseConfig } from "@zayne-labs/callapi/utils";
import { apiSchema } from "./apiSchema";
import { authPlugin, toastPlugin, type AuthPluginMeta, type ToastPluginMeta } from "./plugins";
import { isAuthTokenRelatedError } from "./plugins/utils";

type GlobalMeta = AuthPluginMeta & ToastPluginMeta;

// declare module "@zayne-labs/callapi" {
// 	// eslint-disable-next-line ts-eslint/consistent-type-definitions
// 	interface Register {
// 		meta: GlobalMeta;
// 	}
// }

const REMOTE_BACKEND_HOST = "https://hon-agnella-cyberaware-ecca99d6.koyeb.app";

// const BACKEND_HOST =
// 	process.env.NODE_ENV === "development" ? "http://127.0.0.1:8000" : REMOTE_BACKEND_HOST;

const BACKEND_HOST = REMOTE_BACKEND_HOST;

const BASE_API_URL = `${BACKEND_HOST}/api`;

const sharedBaseCallApiConfig = defineBaseConfig({
	baseURL: BASE_API_URL,

	dedupeCacheScope: "global",
	dedupeCacheScopeKey: (ctx) => ctx.options.baseURL,

	plugins: [
		authPlugin({
			// routesToExemptFromHeaderAddition: ["/auth/**"],
			// navigateFn: redirectTo,
			routesToExemptFromRedirectOnAuthError: ["/", "/auth/**"],
			signInRoute: "/auth/signin",
		}),
		toastPlugin({
			endpointsToSkip: {
				errorAndSuccess: ["@post/token-refresh"],
				success: ["@get/session"],
			},
			errorAndSuccess: true,
			errorsToSkip: ["AbortError"],
			errorsToSkipCondition: (error) => isAuthTokenRelatedError(error),
		}),
		loggerPlugin({
			enabled: { onError: true },
		}),
	],

	schema: apiSchema,
});

const createFetchClient = createFetchClientWithContext<{ Meta: GlobalMeta }>();

export const callBackendApi = createFetchClient(sharedBaseCallApiConfig);

export const callBackendApiForQuery = createFetchClient({
	...sharedBaseCallApiConfig,
	resultMode: "onlyData",
	throwOnError: true,
});
