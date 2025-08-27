import type { CallApiResultErrorVariant } from "@zayne-labs/callapi";
import { isHTTPError } from "@zayne-labs/callapi/utils";
import { hardNavigate, isBrowser } from "@zayne-labs/toolkit-core";
import { toast } from "sonner";
import type { BaseApiErrorResponse } from "../../apiSchema";
import { redirectionRoute, routesToIncludeForRedirection } from "../authPlugin";

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

/* eslint-disable ts-eslint/no-unnecessary-condition */
export const authTokenObject = {
	accessToken: () => globalThis.localStorage?.getItem("accessToken"),
	refreshToken: () => globalThis.localStorage?.getItem("refreshToken"),
};
/* eslint-enable ts-eslint/no-unnecessary-condition */

const defaultRedirectionMessage = "Session is missing! Redirecting to login...";

export const isDefaultRedirectionMessage = (
	error: CallApiResultErrorVariant<Record<string, unknown>>["error"]
) => {
	return error.message === defaultRedirectionMessage;
};

export const redirectAndThrow = (message = defaultRedirectionMessage) => {
	const containsProtectedRoute = routesToIncludeForRedirection.some((route) => isMatchedRoute(route));

	if (containsProtectedRoute) {
		toast.error(message);

		setTimeout(() => hardNavigate(redirectionRoute), 1500);
	}

	throw new Error(message);
};

export const isMatchedRoute = (route: string) => {
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
