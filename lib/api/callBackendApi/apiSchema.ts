import { defineSchema, fallBackRouteSchemaKey } from "@zayne-labs/callapi";
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

const ModuleObjectSchema = z.object({
	description: z.string(),
	id: z.number(),
	module_type: z.string(),
	mux_playback: z.string(),
	mux_playback_url: z.url(),
	name: z.string(),
});

export const QuizOptionUnionSchema = z.literal(
	["A", "B", "C", "D"],
	"At least one option must be selected"
);

export const apiSchema = defineSchema(
	{
		/* eslint-disable perfectionist/sort-objects */
		[fallBackRouteSchemaKey]: {
			errorData: withBaseErrorResponse(),
		},

		"@get/certificate": {
			/* eslint-enable perfectionist/sort-objects */
			data: withBaseSuccessResponse(
				z.object({
					certificate_id: z.string(),
					certificate_url: z.url(),
					is_valid: z.boolean(),
					issued_date: z.string(),
					score: z.number().int().nonnegative(),
					user_email: z.string(),
					user_name: z.string(),
				})
			),
		},

		"@get/certificate/:id/download": {},

		"@get/dashboard": {
			data: withBaseSuccessResponse(
				z.object({
					completed_modules: z.int().nonnegative(),
					modules: z.array(ModuleObjectSchema),
					percentage_completed: z.number().min(0).max(100),
					total_modules: z.int().nonnegative(),
				})
			),
		},

		"@get/module/:id": {
			data: withBaseSuccessResponse(
				z.object({
					module: ModuleObjectSchema,
				})
			),
		},

		"@get/module/:id/quiz": {
			data: withBaseSuccessResponse(
				z.array(
					z.object({
						correct_answer: QuizOptionUnionSchema,
						id: z.number(),
						module: z.int().positive(),
						options: z.record(QuizOptionUnionSchema, z.string()),
						question: z.string(),
					})
				)
			),
		},

		"@get/quiz": {
			data: withBaseSuccessResponse(
				z.array(
					z.object({
						options: z.array(QuizOptionUnionSchema),
						question: z.string(),
					})
				)
			),
		},

		"@get/session": {
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

		"@post/change-password": {
			body: z.object({
				new_password: z.string().min(8, "Password must be at least 8 characters long"),
				old_password: z.string().min(8, "Password must be at least 8 characters long"),
			}),
			data: withBaseSuccessResponse(
				z.object({
					email: z.string(),
					password_changed: z.boolean(),
				})
			),
		},

		"@post/forgot-password": {
			body: z.object({ email: z.email() }),
			data: withBaseSuccessResponse(
				z.object({
					email: z.string(),
					otp_resent: z.boolean(),
				})
			),
		},

		"@post/login": {
			body: z.object({
				email: z.email(),
				password: z.string(),
			}),
			data: withBaseSuccessResponse(
				z.object({
					access: z.jwt(),
					email: z.string(),
					first_login: z.boolean(),
					refresh: z.jwt(),
				})
			),
		},

		"@post/module/:id/complete": {
			data: withBaseSuccessResponse(
				z.object({
					completed: z.boolean(),
					module: ModuleObjectSchema,
				})
			),
		},

		"@post/quiz": {
			body: z.array(
				z.object({
					question: z.string(),
					selected_option: QuizOptionUnionSchema,
				})
			),
			data: withBaseSuccessResponse(
				z.object({
					attempt_number: z.number().int().positive(),
					correct_answers: z.number().int().nonnegative(),
					passed: z.boolean(),
					score: z.union([z.string(), z.number()]),
					total_questions: z.number().int().positive(),
				})
			),
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
		},

		"@post/resend-otp": {
			body: z.object({ email: z.email() }),
			data: withBaseSuccessResponse(
				z.object({
					email: z.string(),
					otp_resent: z.boolean(),
				})
			),
		},

		"@post/reset-password": {
			body: z.object({
				code: CodeSchema,
				email: z.email(),
				new_password: z.string().min(8, "Password must be at least 8 characters long"),
			}),
			data: withBaseSuccessResponse(
				z.object({
					email: z.string(),
					otp_resent: z.boolean(),
				})
			),
		},

		"@post/token-refresh": {
			body: z.object({ refresh: z.jwt() }),
			data: withBaseSuccessResponse(
				z.object({
					access: z.jwt(),
				})
			),
		},

		"@post/verify-otp": {
			body: z.object({ code: CodeSchema, email: z.email() }),
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
		},
	},
	{ strict: true }
);
