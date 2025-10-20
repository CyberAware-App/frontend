import { createFetchClient, defineBaseConfig } from "@zayne-labs/callapi";
import { apiSchema } from "./apiSchema";
import { type AuthPluginMeta, authPlugin, type ToastPluginMeta, toastPlugin } from "./plugins";
import { isAuthTokenRelatedError } from "./plugins/utils";

type GlobalMeta = AuthPluginMeta & ToastPluginMeta;

declare module "@zayne-labs/callapi" {
	// eslint-disable-next-line ts-eslint/consistent-type-definitions
	interface Register {
		meta: GlobalMeta;
	}
}

const REMOTE_BACKEND_HOST = "https://familiar-lethia-ferditech-4c835a92.koyeb.app";

// const BACKEND_HOST =
// 	process.env.NODE_ENV === "development" ? "http://127.0.0.1:8000" : REMOTE_BACKEND_HOST;

const BACKEND_HOST = REMOTE_BACKEND_HOST;

const BASE_API_URL = `${BACKEND_HOST}/api`;

const sharedBaseConfig = defineBaseConfig((instanceCtx) => ({
	baseURL: BASE_API_URL,

	dedupe: {
		cacheScope: "global",
		cacheScopeKey: instanceCtx.options.baseURL,
	},

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
		}) satisfies ReturnType<typeof defineBaseConfig>
);
