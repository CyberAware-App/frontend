import type { CallApiResultErrorVariant } from "@zayne-labs/callapi";
import { isHTTPError } from "@zayne-labs/callapi/utils";
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
