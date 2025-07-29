import {
	type CallApiResultErrorVariant,
	definePlugin,
	type ErrorContext,
	type SuccessContext,
} from "@zayne-labs/callapi";
import { isHTTPError } from "@zayne-labs/callapi/utils";
import { toast } from "sonner";
import type { BaseApiErrorResponse, BaseApiSuccessResponse } from "../apiSchema";

export type ToastPluginMeta = {
	toast?: {
		endpointsToSkip?: {
			error?: Array<string | undefined>;
			errorAndSuccess?: Array<string | undefined>;
			success?: Array<string | undefined>;
		};
		error?: boolean;
		errorMessageField?: string;
		errorsToSkip?: Array<CallApiResultErrorVariant<unknown>["error"]["name"]>;
		errorsToSkipCondition?: (
			error: CallApiResultErrorVariant<BaseApiErrorResponse>["error"]
		) => boolean | undefined;
		success?: boolean;
	};
};

export const toastPlugin = definePlugin(() => ({
	id: "toast-plugin",
	name: "toastPlugin",

	hooks: {
		onError: (ctx: ErrorContext<BaseApiErrorResponse>) => {
			const toastMeta = ctx.options.meta?.toast;

			/* eslint-disable ts-eslint/prefer-nullish-coalescing */
			const shouldSkipErrorToast =
				!toastMeta?.error
				|| toastMeta.endpointsToSkip?.error?.includes(ctx.options.initURLNormalized)
				|| toastMeta.endpointsToSkip?.errorAndSuccess?.includes(ctx.options.initURLNormalized)
				|| toastMeta.errorsToSkip?.includes(ctx.error.name)
				|| toastMeta.errorsToSkipCondition?.(ctx.error);
			/* eslint-enable ts-eslint/prefer-nullish-coalescing */

			if (shouldSkipErrorToast) return;

			if (!isHTTPError(ctx.error) || !ctx.error.errorData.errors) {
				toast.error(ctx.error.message);
				return;
			}

			for (const message of Object.values(ctx.error.errorData.errors)) {
				toast.error(message);
			}
		},

		onSuccess: (ctx: SuccessContext<BaseApiSuccessResponse>) => {
			const toastMeta = ctx.options.meta?.toast;

			/* eslint-disable ts-eslint/prefer-nullish-coalescing */
			const shouldSkipSuccessToast =
				!toastMeta?.success
				|| toastMeta.endpointsToSkip?.success?.includes(ctx.options.initURLNormalized)
				|| toastMeta.endpointsToSkip?.errorAndSuccess?.includes(ctx.options.initURLNormalized);
			/* eslint-enable ts-eslint/prefer-nullish-coalescing */

			if (shouldSkipSuccessToast) return;

			toast.success(ctx.data.message);
		},
	},
}));
