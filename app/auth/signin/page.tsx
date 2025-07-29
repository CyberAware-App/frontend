"use client";

import { useRouter } from "@bprogress/next";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { pickKeys } from "@zayne-labs/toolkit-core";
import { Form } from "@zayne-labs/ui-react/ui/form";
import { useForm } from "react-hook-form";
import { Main } from "@/app/-components";
import { NavLink } from "@/components/common/NavLink";
import { Button } from "@/components/ui/button";
import { apiSchema, callBackendApi } from "@/lib/api/callBackendApi";
import { sessionQuery } from "@/lib/api/queryOptions";
import { resendOtp } from "../verify-account/utils";

const SigninSchema = apiSchema.routes["/login"].body;

function SigninPage() {
	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		mode: "onTouched",
		resolver: zodResolver(SigninSchema),
	});

	const router = useRouter();

	const queryClient = useQueryClient();

	const onSubmit = form.handleSubmit(async (data) => {
		await callBackendApi("/login", {
			body: data,

			method: "POST",

			onResponseError: (ctx) => {
				if (
					ctx.error.errorData.errors.email
					&& ctx.error.errorData.errors.email === "User is not verified."
				) {
					localStorage.setItem("email", data.email);

					queryClient.setQueryData(sessionQuery().queryKey, (oldData) => ({
						...(oldData as NonNullable<typeof oldData>),
						data: {
							...(oldData?.data as NonNullable<typeof oldData>["data"]),
							email: data.email,
						},
					}));

					void resendOtp(data.email);

					router.push("/auth/verify-account");
				}
			},

			onSuccess: (ctx) => {
				localStorage.setItem("accessToken", ctx.data.data.access);
				localStorage.setItem("refreshToken", ctx.data.data.refresh);

				queryClient.setQueryData(sessionQuery().queryKey, (oldData) => ({
					...(oldData as NonNullable<typeof oldData>),
					data: {
						...(oldData?.data as NonNullable<typeof oldData>["data"]),
						...pickKeys(ctx.data.data, ["email"]),
					},
				}));

				router.push("/dashboard");
			},
		});
	});

	return (
		<Main className="gap-13 px-4 pb-[158px]">
			<header className="flex flex-col gap-5">
				<h1 className="text-[36px] font-bold text-white">Welcome Back </h1>
				<p className="text-[14px] text-white">Log In to continue your 10-day cybersecurity Journey</p>
				<p className="flex gap-1">
					<span className="text-cyberaware-neutral-gray-light/50">Don't have an Account?</span>
					<NavLink href="/auth/signup" className="text-cyberaware-primary-blue-light">
						Create one
					</NavLink>
				</p>
			</header>

			<section>
				<Form.Root
					methods={form}
					className="flex flex-col gap-6"
					onSubmit={(event) => void onSubmit(event)}
				>
					<Form.Field control={form.control} name="email">
						<Form.Label className="text-white">Email address</Form.Label>
						<Form.Input
							placeholder="Enter email address"
							className="h-[64px] border-2 border-cyberaware-neutral-gray-light px-8 text-base
								text-white placeholder:text-white/50 data-invalid:border-red-600"
						/>

						<Form.ErrorMessage />
					</Form.Field>

					<Form.Field control={form.control} name="password">
						<Form.Label className="text-white">Password</Form.Label>
						<Form.Input
							type="password"
							placeholder="Enter password"
							classNames={{
								input: "text-base text-white placeholder:text-white/50",
								inputGroup: `h-[64px] border-2 border-cyberaware-neutral-gray-light px-8 text-white
								data-invalid:border-red-600`,
							}}
						/>

						<Form.ErrorMessage />

						<NavLink
							href="/auth/reset-password"
							className="self-end font-semibold text-cyberaware-primary-blue-light"
						>
							Forgot Password?
						</NavLink>
					</Form.Field>

					<Form.Submit asChild={true} className="mt-[42px]">
						<Button
							isLoading={form.formState.isSubmitting}
							isDisabled={form.formState.isSubmitting}
							className="h-[64px] max-w-[260px] self-end"
						>
							Log In
						</Button>
					</Form.Submit>
				</Form.Root>
			</section>
		</Main>
	);
}

export default SigninPage;
