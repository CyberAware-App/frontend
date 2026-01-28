import type { RequestContext, ResponseErrorContext } from "@zayne-labs/callapi";
import { definePlugin, isHTTPError } from "@zayne-labs/callapi/utils";
import type { Awaitable, CallbackFn } from "@zayne-labs/toolkit-type-helpers";
import type { BaseApiErrorResponse } from "../apiSchema";
import type { ToastPluginMeta } from "./toastPlugin";
import {
	authTokenStore,
	isAuthTokenRelatedError,
	isPathnameMatchingRoute,
	redirectTo,
	type PossibleAuthTokenUnion,
} from "./utils";
import { getNewUserSession } from "./utils/session";

export type AuthPluginMeta = {
	auth?: {
		redirectFn?: CallbackFn<`/${string}`, Awaitable<void>>;
		routesToExemptFromHeaderAddition?: Array<`/${string}` | `${string}/**`>;
		routesToExemptFromRedirectOnAuthError?: Array<`/${string}` | `${string}/**`>;
		signInRoute?: `/${string}`;
		skipHeaderAddition?: boolean;
		tokenToAdd?: PossibleAuthTokenUnion;
	};
};

const defaultSignInRoute = "/auth/signin";

const defaultRedirectionMessage = "Session is missing! Automatically redirecting to login...";

const defaultErrorMessage = "Session is missing!";

const defaultRedirectionMessageOnHTTPError =
	"Session is invalid or expired! Automatically redirecting to login...";

export const authPlugin = (authOptions?: AuthPluginMeta["auth"]) => {
	const getAuthMetaAndDerivatives = (ctx: RequestContext<{ Meta: AuthPluginMeta & ToastPluginMeta }>) => {
		const authMeta =
			authOptions ? { ...authOptions, ...ctx.options.meta?.auth } : ctx.options.meta?.auth;

		const redirectFn = authMeta?.redirectFn ?? redirectTo;
		const signInRoute = authMeta?.signInRoute ?? defaultSignInRoute;

		const isExemptedRoute = Boolean(
			authMeta?.routesToExemptFromHeaderAddition?.some((route) => isPathnameMatchingRoute(route))
		);

		const shouldSkipAuthHeaderAddition = isExemptedRoute || authMeta?.skipHeaderAddition;

		const shouldSkipRouteFromRedirect = authMeta?.routesToExemptFromRedirectOnAuthError?.some((route) =>
			isPathnameMatchingRoute(route)
		);

		const turnOffErrorToast = () => {
			ctx.options.meta ??= {};
			ctx.options.meta.toast ??= {};
			ctx.options.meta.toast.error = false;
		};

		return {
			authMeta,
			redirectFn,
			shouldSkipAuthHeaderAddition,
			shouldSkipRouteFromRedirect,
			signInRoute,
			turnOffErrorToast,
		};
	};

	return definePlugin({
		id: "auth-plugin",
		name: "authPlugin",

		// eslint-disable-next-line perfectionist/sort-objects
		hooks: {
			onRequest: (ctx: RequestContext<{ Meta: AuthPluginMeta }>) => {
				const {
					authMeta,
					redirectFn,
					shouldSkipAuthHeaderAddition,
					shouldSkipRouteFromRedirect,
					signInRoute,
					turnOffErrorToast,
				} = getAuthMetaAndDerivatives(ctx);

				if (shouldSkipAuthHeaderAddition) return;

				const refreshToken = authTokenStore.getRefreshToken();

				if (refreshToken === null) {
					// == Turn off error toast if redirect is skipped
					shouldSkipRouteFromRedirect && turnOffErrorToast();

					// == Redirect if redirect is not skipped
					!shouldSkipRouteFromRedirect && void redirectFn(signInRoute);

					throw new Error(
						shouldSkipRouteFromRedirect ? defaultErrorMessage : defaultRedirectionMessage
					);
				}

				const selectedAuthToken = authTokenStore[authMeta?.tokenToAdd ?? "getAccessToken"]();

				ctx.options.auth = selectedAuthToken;
			},

			onResponseError: async (ctx: ResponseErrorContext<{ ErrorData: BaseApiErrorResponse }>) => {
				const { redirectFn, shouldSkipAuthHeaderAddition, shouldSkipRouteFromRedirect, signInRoute } =
					getAuthMetaAndDerivatives(ctx);

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

					throw new Error(defaultRedirectionMessageOnHTTPError);
				}

				result.data?.data && authTokenStore.setAccessToken({ access: result.data.data.access });

				ctx.options.retryAttempts = 1;
			},
		},
	});
};
