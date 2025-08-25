import { definePlugin, type ResponseErrorContext } from "@zayne-labs/callapi";
import { hardNavigate } from "@zayne-labs/toolkit-core";
import type { BaseApiErrorResponse } from "../apiSchema";
import { isAuthTokenRelatedError } from "./utils";
import { refreshUserSession } from "./utils/refreshUserSession";

type PossibleAuthToken = "accessToken" | "refreshToken";

export type AuthPluginMeta = {
	auth?: {
		authTokenToAdd?: PossibleAuthToken;
		routesToExemptFromHeaderAddition?: string[];
		skipHeaderAddition?: boolean;
	};
};
export const authPlugin = definePlugin(() => ({
	id: "auth-plugin",
	name: "authPlugin",

	hooks: {
		onRequest: (ctx) => {
			const authMeta = ctx.options.meta?.auth;

			const shouldSkipAuthHeaderAddition =
				authMeta?.routesToExemptFromHeaderAddition?.some(
					(route) => window.location.pathname.includes(route)
					// eslint-disable-next-line ts-eslint/prefer-nullish-coalescing
				) || authMeta?.skipHeaderAddition;

			if (shouldSkipAuthHeaderAddition) return;

			const authTokenObject = {
				accessToken: localStorage.getItem("accessToken"),
				refreshToken: localStorage.getItem("refreshToken"),
			} satisfies Record<PossibleAuthToken, string | null>;

			if (!authTokenObject.refreshToken) {
				const message = "Session is missing! Redirecting to login...";

				setTimeout(() => hardNavigate("/auth/signin"), 2100);

				throw new Error(message);
			}

			const selectedAuthToken = authTokenObject[authMeta?.authTokenToAdd ?? "accessToken"];

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
