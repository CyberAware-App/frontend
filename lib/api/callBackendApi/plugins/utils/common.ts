import type { CallApiResultErrorVariant } from "@zayne-labs/callapi";
import { isHTTPError } from "@zayne-labs/callapi/utils";
import { hardNavigate, isBrowser } from "@zayne-labs/toolkit-core";
import type { BaseApiErrorResponse } from "../../apiSchema";

type ErrorWithCodeAndDetail = CallApiResultErrorVariant<BaseApiErrorResponse>["error"] & {
	errorData: { code: string; detail: string } | { code?: never; detail: string };
};

export const isAuthTokenRelatedError = (
	error: CallApiResultErrorVariant<Record<string, unknown>>["error"]
): error is ErrorWithCodeAndDetail => {
	if (!isHTTPError(error)) {
		return false;
	}

	const errorData = error.errorData;

	return (
		("code" in errorData && errorData.code === "token_not_valid")
		|| ("detail" in errorData && errorData.detail === "Authentication credentials were not provided.")
	);
};
export type PossibleAuthToken = "accessToken" | "refreshToken";

const refreshTokenKey = "refreshToken";
const accessTokenKey = "accessToken";

/* eslint-disable ts-eslint/no-unnecessary-condition */
export const authTokenObject = {
	accessToken: () => globalThis.localStorage?.getItem(accessTokenKey),
	refreshToken: () => globalThis.localStorage?.getItem(refreshTokenKey),
	clearTokens: () => {
		globalThis.localStorage?.removeItem(accessTokenKey);
		globalThis.localStorage?.removeItem(refreshTokenKey);
	},
};
/* eslint-enable ts-eslint/no-unnecessary-condition */

export const redirectTo = (route: AppRoutes) => {
	setTimeout(() => hardNavigate(route), 1500);
};

export const isPathnameMatchingRoute = (route: string) => {
	if (!isBrowser()) {
		return false;
	}

	const isCatchAllRoute = route.endsWith("/**");

	const pathname = globalThis.location.pathname;

	if (isCatchAllRoute) {
		const actualRoute = route.slice(0, -3);

		return pathname.includes(actualRoute);
	}

	return pathname.endsWith(route);
};
