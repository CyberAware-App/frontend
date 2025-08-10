import type { CallApiResultErrorVariant } from "@zayne-labs/callapi";
import { isHTTPError } from "@zayne-labs/callapi/utils";
import type { BaseApiErrorResponse } from "../../apiSchema";

type ErrorDataWithCodeAndDetail = { code: string; detail: string } | { code?: never; detail: string };

export const isAuthTokenRelatedError = (
	error: CallApiResultErrorVariant<BaseApiErrorResponse>["error"]
): error is { errorData: ErrorDataWithCodeAndDetail } & typeof error => {
	if (!isHTTPError(error)) {
		return false;
	}

	const errorData = error.errorData;

	return (
		("code" in errorData && errorData.code === "token_not_valid")
		|| ("detail" in errorData && errorData.detail === "Authentication credentials were not provided.")
	);
};
