import { createFetchClientWithContext } from "@zayne-labs/callapi";
import { loggerPlugin } from "@zayne-labs/callapi-plugins";
import { defineBaseConfig } from "@zayne-labs/callapi/utils";
import { apiSchema } from "./apiSchema";
import { BASE_API_URL } from "./constants";
import { authPlugin, toastPlugin, type AuthPluginMeta, type ToastPluginMeta } from "./plugins";
import { isAuthTokenRelatedError } from "./plugins/utils";

type GlobalMeta = AuthPluginMeta & ToastPluginMeta;

// declare module "@zayne-labs/callapi" {
// 	// eslint-disable-next-line ts-eslint/consistent-type-definitions
// 	interface Register {
// 		meta: GlobalMeta;
// 	}
// }

const sharedBaseCallApiConfig = defineBaseConfig({
	baseURL: BASE_API_URL,

	dedupeCacheScope: "global",
	dedupeCacheScopeKey: (ctx) => ctx.options.baseURL,

	extraFetchOptions: {
		next: {
			revalidate: 30,
		},
	},

	plugins: [
		authPlugin({
			// routesToExemptFromHeaderAddition: ["/auth/**"],
			// navigateFn: redirectTo,
			redirectRoute: "/auth/signin",
			routesToExemptFromRedirectOnAuthError: ["/", "/auth/**"],
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
