import { definePlugin, type ResponseErrorContext } from "@zayne-labs/callapi";
import { isBrowser } from "@zayne-labs/toolkit-core";
import type { BaseApiErrorResponse } from "../apiSchema";
import {
	authTokenObject,
	isAuthTokenRelatedError,
	isMatchedRoute,
	redirectAndThrow,
	type PossibleAuthToken,
} from "./utils";
import { refreshUserSession } from "./utils/refreshUserSession";

export type AuthPluginMeta = {
	auth?: {
		authTokenToAdd?: PossibleAuthToken;
		routesToExemptFromHeaderAddition?: Array<`/${string}` | `/${string}/**`>;
		skipHeaderAddition?: boolean;
	};
};

export const routesToIncludeForRedirection = ["/dashboard/**"];

export const redirectionRoute = "/auth/signin";

export const authPlugin = definePlugin(() => ({
	id: "auth-plugin",
	name: "authPlugin",

	hooks: {
		onRequest: (ctx) => {
			if (!isBrowser()) return;

			const authMeta = ctx.options.meta?.auth;

			const shouldSkipAuthHeaderAddition =
				authMeta?.routesToExemptFromHeaderAddition?.some(
					(route) => isMatchedRoute(route)
					// eslint-disable-next-line ts-eslint/prefer-nullish-coalescing
				) || authMeta?.skipHeaderAddition;

			if (shouldSkipAuthHeaderAddition) return;

			if (!authTokenObject.refreshToken()) {
				return redirectAndThrow();
			}

			const selectedAuthToken = authTokenObject[authMeta?.authTokenToAdd ?? "accessToken"]();

			ctx.options.auth = selectedAuthToken;
		},

		onResponseError: async (ctx: ResponseErrorContext<BaseApiErrorResponse>) => {
			// NOTE: Only call refreshUserSession on auth token related errors, and remake the request
			const shouldRefreshToken = ctx.response.status === 401 && isAuthTokenRelatedError(ctx.error);

			if (!shouldRefreshToken) return;

			await refreshUserSession();

			// NOTE: This will not work for requests made via react query, which in that case retries are up to react query
			ctx.options.retryAttempts = 1;
		},
	},
}));
