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

export type AuthPluginMeta = {
	auth?: {
		routesToExemptFromHeaderAddition?: Array<`/${string}/**` | `/${string}`>;
		routesToIncludeForRedirectionOnAuthError?: Array<`/${string}/**` | `/${string}`>;
		skipHeaderAddition?: boolean;
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

			const isProtectedRoute = authMeta?.routesToIncludeForRedirectionOnAuthError?.some((route) =>
				isPathnameMatchingRoute(route)
			);

			if (authTokenObject.getRefreshToken() === null) {
				isProtectedRoute && redirectTo(signInRoute);

				// == Turn off error toast if route is not protected
				!isProtectedRoute && ctx.options.meta?.toast && (ctx.options.meta.toast.error = false);

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

			const isProtectedRoute = authMeta?.routesToIncludeForRedirectionOnAuthError?.some((route) =>
				isPathnameMatchingRoute(route)
			);

			const refreshToken = authTokenObject.getRefreshToken();

			if (refreshToken === null) {
				isProtectedRoute && redirectTo(signInRoute);

				throw new Error(defaultRedirectionMessage);
			}

			const result = await getNewUserSession(refreshToken);

			if (isHTTPError(result.error)) {
				isProtectedRoute && redirectTo(signInRoute);

				throw new Error("Session invalid or expired! Redirecting to login...");
			}

			result.data?.data && authTokenObject.setAccessToken({ access: result.data.data.access });

			// NOTE: This will not work for requests made via react query, which in that case retries are up to react query
			ctx.options.retryAttempts = 1;
		},
	},
}));
