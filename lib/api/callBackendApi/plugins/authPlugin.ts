import { definePlugin, type ResponseErrorContext } from "@zayne-labs/callapi";
import { isHTTPError } from "@zayne-labs/callapi/utils";
import type { BaseApiErrorResponse } from "../apiSchema";
import {
	authTokenObject,
	isAuthTokenRelatedError,
	isPathnameMatchingRoute,
	type PossibleAuthToken,
	redirectTo,
} from "./utils";
import { getNewUserSession } from "./utils/session";
import type { Awaitable, CallbackFn } from "@zayne-labs/toolkit-type-helpers";

export type AuthPluginMeta = {
	auth?: {
		routesToExemptFromHeaderAddition?: Array<AppRoutes | `${string}/**`>;
		routesToExemptFromRedirectOnAuthError?: Array<AppRoutes | `${string}/**`>;
		skipHeaderAddition?: boolean;
		redirectFn?: CallbackFn<AppRoutes, Awaitable<void>>;
		tokenToAdd?: PossibleAuthToken;
	};
};

const signInRoute = "/auth/signin" satisfies AppRoutes;

const defaultRedirectionMessage = "Session is missing! Redirecting to login...";

export const authPlugin = definePlugin((authOptions?: AuthPluginMeta["auth"]) => ({
	id: "auth-plugin",
	name: "authPlugin",

	hooks: {
		onRequest: (ctx) => {
			const authMeta = authOptions ?? ctx.options.meta?.auth;

			const isExemptedRoute = Boolean(
				authMeta?.routesToExemptFromHeaderAddition?.some((route) => isPathnameMatchingRoute(route))
			);

			const shouldSkipAuthHeaderAddition = isExemptedRoute || authMeta?.skipHeaderAddition;

			if (shouldSkipAuthHeaderAddition) return;

			const shouldSkipRouteFromRedirect = authMeta?.routesToExemptFromRedirectOnAuthError?.some(
				(route) => isPathnameMatchingRoute(route)
			);

			if (authTokenObject.getRefreshToken() === null) {
				const redirectFn = authMeta?.redirectFn ?? redirectTo;

				!shouldSkipRouteFromRedirect && void redirectFn(signInRoute);

				// == Turn off error toast if redirect is skipped
				shouldSkipRouteFromRedirect
					&& ctx.options.meta?.toast
					&& (ctx.options.meta.toast.error = false);

				throw new Error(defaultRedirectionMessage);
			}

			const selectedAuthToken = authTokenObject[authMeta?.tokenToAdd ?? "getAccessToken"]();

			ctx.options.auth = selectedAuthToken;
		},

		onResponseError: async (ctx: ResponseErrorContext<BaseApiErrorResponse>) => {
			const authMeta = authOptions ?? ctx.options.meta?.auth;

			// NOTE: Only call refreshUserSession on auth token related errors, and remake the request
			const shouldRefreshToken = ctx.response.status === 401 && isAuthTokenRelatedError(ctx.error);

			if (!shouldRefreshToken) return;

			const refreshToken = authTokenObject.getRefreshToken();

			const shouldExemptRouteFromRedirect = authMeta?.routesToExemptFromRedirectOnAuthError?.some(
				(route) => isPathnameMatchingRoute(route)
			);

			const redirectFn = authMeta?.redirectFn ?? redirectTo;

			if (refreshToken === null) {
				!shouldExemptRouteFromRedirect && void redirectFn(signInRoute);

				throw new Error(defaultRedirectionMessage);
			}

			const result = await getNewUserSession(refreshToken);

			if (isHTTPError(result.error)) {
				!shouldExemptRouteFromRedirect && void redirectFn(signInRoute);

				throw new Error("Session invalid or expired! Redirecting to login...");
			}

			result.data?.data && authTokenObject.setAccessToken({ access: result.data.data.access });

			// NOTE: This will not work for requests made via react query, which in that case retries are up to react query
			ctx.options.retryAttempts = 1;
		},
	},
}));
