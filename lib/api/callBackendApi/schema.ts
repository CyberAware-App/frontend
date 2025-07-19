import { defineSchema } from "@zayne-labs/callapi";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { z } from "zod";

const BaseSuccessResponseSchema = z.object({
	data: z.record(z.string(), z.unknown()),
	message: z.string(),
	status: z.literal("success"),
});

const BaseErrorResponseSchema = z.object({
	errors: z.record(z.string(), z.string()).nullable(),
	message: z.string(),
	status: z.literal("error"),
});

export type BaseApiSuccessResponse = z.infer<typeof BaseSuccessResponseSchema>;

export type BaseApiErrorResponse = z.infer<typeof BaseErrorResponseSchema>;

const withBaseSuccessResponse = <TSchemaObject extends z.ZodType>(dataSchema: TSchemaObject) =>
	z.object({
		...BaseSuccessResponseSchema.shape,
		data: dataSchema,
	});

const withBaseErrorResponse = <
	TSchemaObject extends z.ZodType = typeof BaseErrorResponseSchema.shape.errors,
>(
	errorSchema?: TSchemaObject
) =>
	z.object({
		...BaseErrorResponseSchema.shape,
		errors: (errorSchema ?? BaseErrorResponseSchema.shape.errors) as NonNullable<TSchemaObject>,
	});

export const apiSchema = defineSchema(
	{
		"/login": {
			body: z.object({
				email: z.email("Invalid email address"),
				password: z.string().min(8, "Password must be at least 8 characters long"),
			}),
			data: withBaseSuccessResponse(
				z.object({ access: z.jwt(), email: z.string(), first_login: z.boolean(), refresh: z.jwt() })
			),
			errorData: withBaseErrorResponse(z.string()),
			method: z.literal("POST"),
		},

		"/register": {
			body: z.object({
				email: z.email("Invalid email address"),
				first_name: z.string().min(3, "First name must be at least 3 characters long"),
				last_name: z.string().min(3, "Last name must be at least 3 characters long"),
				password: z.string().min(8, "Password must be at least 8 characters long"),
			}),
			data: withBaseSuccessResponse(
				z.object({
					access: z.jwt(),
					email: z.string(),
					first_name: z.string(),
					last_name: z.string(),
					otp_sent: z.boolean(),
					refresh: z.jwt(),
				})
			),
			errorData: withBaseErrorResponse(
				z
					.object({
						email: z.string(),
						first_name: z.string(),
						last_name: z.string(),
						password: z.string(),
					})
					.partial()
			),
			method: z.literal("POST"),
		},

		"/resend-otp": {
			body: z.object({ email: z.email() }),
			data: withBaseSuccessResponse(z.object({ email: z.string(), otp_sent: z.boolean() })),
			errorData: withBaseErrorResponse(z.null()),
			method: z.literal("POST"),
		},

		"/session": {
			data: withBaseSuccessResponse(
				z.object({
					email: z.string(),
					first_name: z.string(),
					has_session: z.boolean(),
					is_verified: z.boolean(),
					last_name: z.string(),
				})
			),
			errorData: withBaseErrorResponse(z.null()),
		},

		"/token-refresh": {
			body: z.object({ refresh: z.jwt() }),
			data: withBaseSuccessResponse(z.object({ access: z.jwt() })),
			errorData: withBaseErrorResponse(z.object({ refresh: z.jwt() })),
			method: z.literal("POST"),
		},

		"/verify-otp": {
			body: z.object({
				code: z.string().min(6, "Invalid code").regex(new RegExp(REGEXP_ONLY_DIGITS), "Invalid code"),
				email: z.email(),
			}),
			data: withBaseSuccessResponse(
				z.object({
					access: z.jwt(),
					email: z.string(),
					first_login: z.boolean(),
					first_name: z.string(),
					refresh: z.jwt(),
					verified: z.boolean(),
				})
			),
			errorData: withBaseErrorResponse(z.object({ code: z.string() })),
			method: z.literal("POST"),
		},
	},
	{
		strict: true,
	}
);
