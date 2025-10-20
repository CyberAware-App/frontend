import { definePlugin, type ResponseErrorContext } from "@zayne-labs/callapi";
import { isHTTPError } from "@zayne-labs/callapi/utils";
import type { Awaitable, CallbackFn } from "@zayne-labs/toolkit-type-helpers";
import type { BaseApiErrorResponse } from "../apiSchema";
import {
	authTokenStore,
	isAuthTokenRelatedError,
	isPathnameMatchingRoute,
	type PossibleAuthToken,
	redirectTo,
} from "./utils";
import { getNewUserSession } from "./utils/session";

export type AuthPluginMeta = {
	auth?: {
		redirectFn?: CallbackFn<AppRoutes, Awaitable<void>>;
		routesToExemptFromHeaderAddition?: Array<`${string}/**` | AppRoutes>;
		routesToExemptFromRedirectOnAuthError?: Array<`${string}/**` | AppRoutes>;
		signInRoute?: AppRoutes;
		skipHeaderAddition?: boolean;
		tokenToAdd?: PossibleAuthToken;
	};
};

const defaultSignInRoute = "/auth/signin" satisfies Required<AuthPluginMeta>["auth"]["signInRoute"];

const defaultRedirectionMessage = "Session is missing! Redirecting to login...";

export const authPlugin = definePlugin((authOptions?: AuthPluginMeta["auth"]) => ({
	id: "auth-plugin",
	name: "authPlugin",

	// eslint-disable-next-line perfectionist/sort-objects
	hooks: (setupCtx) => {
		const authMeta =
			authOptions ? { ...authOptions, ...setupCtx.options.meta?.auth } : setupCtx.options.meta?.auth;

		const redirectFn = authMeta?.redirectFn ?? redirectTo;
		const signInRoute = authMeta?.signInRoute ?? defaultSignInRoute;

		const isExemptedRoute = Boolean(
			authMeta?.routesToExemptFromHeaderAddition?.some((route) => isPathnameMatchingRoute(route))
		);

		const shouldSkipAuthHeaderAddition = isExemptedRoute || authMeta?.skipHeaderAddition;

		const shouldSkipRouteFromRedirect = authMeta?.routesToExemptFromRedirectOnAuthError?.some((route) =>
			isPathnameMatchingRoute(route)
		);

		return {
			onRequest: (ctx) => {
				if (shouldSkipAuthHeaderAddition) return;

				if (authTokenStore.getRefreshToken() === null) {
					!shouldSkipRouteFromRedirect && void redirectFn(signInRoute);

					// == Turn off error toast if redirect is skipped
					shouldSkipRouteFromRedirect
						&& ctx.options.meta?.toast
						&& (ctx.options.meta.toast.error = false);

					throw new Error(defaultRedirectionMessage);
				}

				const selectedAuthToken = authTokenStore[authMeta?.tokenToAdd ?? "getAccessToken"]();

				ctx.options.auth = selectedAuthToken;
			},

			onResponseError: async (ctx: ResponseErrorContext<BaseApiErrorResponse>) => {
				if (shouldSkipAuthHeaderAddition) return;

				// NOTE: Only call refreshUserSession on auth token related errors, and remake the request
				const shouldRefreshToken = ctx.response.status === 401 && isAuthTokenRelatedError(ctx.error);

				if (!shouldRefreshToken) return;

				const refreshToken = authTokenStore.getRefreshToken();

				if (refreshToken === null) {
					!shouldSkipRouteFromRedirect && void redirectFn(signInRoute);

					throw new Error(defaultRedirectionMessage);
				}

				const result = await getNewUserSession(refreshToken);

				if (isHTTPError(result.error)) {
					!shouldSkipRouteFromRedirect && void redirectFn(signInRoute);

					throw new Error("Session invalid or expired! Redirecting to login...");
				}

				result.data?.data && authTokenStore.setAccessToken({ access: result.data.data.access });

				ctx.options.retryAttempts = 1;
			},
		};
	},
}));
