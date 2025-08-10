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

const CodeSchema = z.string().min(6, "Invalid code").regex(new RegExp(REGEXP_ONLY_DIGITS), "Invalid code");

export const apiSchema = defineSchema(
	{
		"@post/forgot-password": {
			body: z.object({ email: z.email() }),
			data: withBaseSuccessResponse(z.object({ email: z.string(), otp_resent: z.boolean() })),
			errorData: withBaseErrorResponse(z.null()),
		},

		"@post/login": {
			body: z.object({
				email: z.email(),
				password: z.string(),
			}),
			data: withBaseSuccessResponse(
				z.object({ access: z.jwt(), email: z.string(), first_login: z.boolean(), refresh: z.jwt() })
			),
			errorData: withBaseErrorResponse(z.object({ email: z.string(), message: z.string() }).partial()),
		},

		"@post/register": {
			body: z.object({
				email: z.email(),
				first_name: z.string().min(3, "First name must be at least 3 characters long"),
				last_name: z.string().min(3, "Last name must be at least 3 characters long"),
				password: z.string().min(8, "Password must be at least 8 characters long"),
			}),
			data: withBaseSuccessResponse(
				z.object({
					email: z.string(),
					first_name: z.string(),
					last_name: z.string(),
					otp_sent: z.boolean(),
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
		},

		"@post/resend-otp": {
			body: z.object({ email: z.email() }),
			data: withBaseSuccessResponse(z.object({ email: z.string(), otp_resent: z.boolean() })),
			errorData: withBaseErrorResponse(z.null()),
		},

		"@post/reset-password": {
			body: z.object({
				code: CodeSchema,
				email: z.email(),
				new_password: z.string().min(8, "Password must be at least 8 characters long"),
			}),
			data: withBaseSuccessResponse(z.object({ email: z.string(), otp_resent: z.boolean() })),
			errorData: withBaseErrorResponse(z.null()),
		},

		"@post/token-refresh": {
			body: z.object({ refresh: z.jwt() }),
			data: withBaseSuccessResponse(z.object({ access: z.jwt() })),
			errorData: withBaseErrorResponse(z.object({ refresh: z.jwt() })),
		},

		"@post/verify-otp": {
			body: z.object({
				code: CodeSchema,
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
		},

		"/dashboard": {
			data: withBaseSuccessResponse(
				z.object({
					completed_modules: z.int().nonnegative(),
					modules: z.array(
						z.object({
							description: z.string(),
							file_url: z.url(),
							id: z.number(),
							module_type: z.string(),
							name: z.string(),
						})
					),
					percentage_completed: z.number().min(0).max(100),
					total_modules: z.int().nonnegative(),
				})
			),
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
		},
	},
	{ strict: true }
);
