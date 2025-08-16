"use client";

import { useRouter } from "@bprogress/next";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@zayne-labs/ui-react/ui/form";
import { useForm } from "react-hook-form";
import { Main } from "@/app/-components";
import { Button } from "@/components/ui/button";
import { callBackendApi } from "@/lib/api/callBackendApi";
import { apiSchema } from "@/lib/api/callBackendApi/apiSchema";

const ForgotPasswordSchema = apiSchema.routes["@post/forgot-password"].body.pick({ email: true });

function ForgotPasswordPage() {
	const form = useForm({
		defaultValues: {
			email: "",
		},
		mode: "onTouched",
		resolver: zodResolver(ForgotPasswordSchema),
	});

	const router = useRouter();

	const onSubmit = form.handleSubmit(async (data) => {
		await callBackendApi("@post/forgot-password", {
			body: data,

			onResponseError: (ctx) => {
				form.setError("email", { message: ctx.error.message });
			},

			onSuccess: (ctx) => {
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
