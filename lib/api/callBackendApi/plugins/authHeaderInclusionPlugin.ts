import { definePlugin, type ResponseErrorContext } from "@zayne-labs/callapi";
import { hardNavigate } from "@zayne-labs/toolkit-core";
import type { BaseApiErrorResponse } from "../apiSchema";
import { isAuthTokenRelatedError } from "./utils";
import { refreshUserSession } from "./utils/refreshUserSession";

const routesExemptedFromAuthHeaderInclusion = new Set(["/auth/signin", "/auth/signup"]);

export type AuthHeaderInclusionPluginMeta = {
	authTokenToAdd?: "accessToken" | "refreshToken";
	skipAuthHeaderAddition?: boolean;
	skipSessionCheck?: boolean;
};

export const authHeaderInclusionPlugin = definePlugin(() => ({
	id: "auth-header-inclusion",
	name: "authHeaderInclusionPlugin",

	hooks: {
		onRequest: (ctx) => {
			const shouldSkipAuthHeaderAddition =
				routesExemptedFromAuthHeaderInclusion.has(window.location.pathname)
				|| ctx.options.meta?.skipAuthHeaderAddition;

			if (shouldSkipAuthHeaderAddition) return;

			const refreshToken = localStorage.getItem("refreshToken");

			if (!refreshToken) {
				const message = "Session is missing! Redirecting to login...";

				setTimeout(() => hardNavigate("/auth/signin"), 2100);

				throw new Error(message);
			}

			const accessToken = localStorage.getItem("accessToken");

			const authTokenToAdd =
				ctx.options.meta?.authTokenToAdd
				?? ("accessToken" satisfies AuthHeaderInclusionPluginMeta["authTokenToAdd"]);

			switch (authTokenToAdd) {
				case "accessToken": {
					ctx.options.auth = accessToken;
					break;
				}
				case "refreshToken": {
					ctx.options.auth = refreshToken;
					break;
				}
				default: {
					throw new Error("Invalid option provided for `authTokenToAdd`");
				}
			}
		},

		// NOTE: Only call refreshUserSession on auth token related errors, and remake the request
		onResponseError: async (ctx: ResponseErrorContext<BaseApiErrorResponse>) => {
			if (
				ctx.response.status === 401
				&& isAuthTokenRelatedError(ctx.error)
				&& !ctx.options.fullURL?.endsWith("/session")
			) {
				await refreshUserSession();

				// NOTE: This will not work for requests made via react query, which in that case retries are up to react query
				ctx.options.retryAttempts = 1;
			}
		},
	},
}));
