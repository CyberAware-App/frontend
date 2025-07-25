"use client";

import { useRouter } from "@bprogress/next";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Form } from "@zayne-labs/ui-react/ui/form";
import { useForm } from "react-hook-form";
import { Main } from "@/app/-components";
import { Button } from "@/components/ui/button";
import { callBackendApi } from "@/lib/api/callBackendApi";
import { backendApiSchema } from "@/lib/api/callBackendApi/apiSchema";
import { sessionQuery } from "@/lib/api/queryOptions";

const ForgotPasswordSchema = backendApiSchema.routes["/forgot-password"].body.pick({ email: true });

function ForgotPasswordPage() {
	const form = useForm({
		defaultValues: {
			email: "",
		},
		mode: "onTouched",
		resolver: zodResolver(ForgotPasswordSchema),
	});

	const queryClient = useQueryClient();

	const router = useRouter();

	const onSubmit = form.handleSubmit(async (data) => {
		await callBackendApi("/forgot-password", {
			body: data,
			method: "POST",

			onResponseError: (ctx) => {
				form.setError("email", { message: ctx.error.message });
			},

			onSuccess: (ctx) => {
				queryClient.setQueryData(sessionQuery().queryKey, (oldData) => ({
					...(oldData as NonNullable<typeof oldData>),
					data: {
						...(oldData?.data as NonNullable<typeof oldData>["data"]),
						email: ctx.data.data.email,
					},
				}));

				localStorage.setItem("email", ctx.data.data.email);

				router.push("/auth/reset-password");
			},
		});
	});

	return (
		<Main className="gap-13 px-4 pb-[158px]">
			<header className="flex flex-col gap-5">
				<h1 className="text-[36px] font-bold text-white">Forgot Password</h1>
				<p className="text-[14px] text-white">Enter your email to reset your password</p>
			</header>

			<section>
				<Form.Root methods={form} className="gap-6" onSubmit={(event) => void onSubmit(event)}>
					<Form.Field control={form.control} name="email">
						<Form.Label className="text-white">Email address</Form.Label>
						<Form.Input
							placeholder="Enter email address"
							className="h-[64px] border-2 border-cyberaware-neutral-gray-light px-8 text-base
								text-white placeholder:text-white/50 data-invalid:border-red-600"
						/>

						<Form.ErrorMessage />
					</Form.Field>

					<Form.Submit asChild={true}>
						<Button className="h-[64px]">Reset password</Button>
					</Form.Submit>
				</Form.Root>
			</section>
		</Main>
	);
}

export default ForgotPasswordPage;
