"use client";

import { useRouter } from "@bprogress/next";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useStorageState } from "@zayne-labs/toolkit-react";
import { Form } from "@zayne-labs/ui-react/ui/form";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useForm } from "react-hook-form";
import { Main } from "@/app/-components";
import { For } from "@/components/common/for";
import { InputOTP } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { apiSchema, callBackendApi } from "@/lib/api/callBackendApi";
import { sessionQuery } from "@/lib/react-query/queryOptions";

const ResetPasswordSchema = apiSchema.routes["@post/reset-password"].body.omit({ email: true });

function ResetPasswordPage() {
	const form = useForm({
		defaultValues: {
			code: "",
			new_password: "",
		},
		mode: "onTouched",
		resolver: zodResolver(ResetPasswordSchema),
	});

	const queryClient = useQueryClient();

	const sessionQueryResult = queryClient.getQueryData(sessionQuery().queryKey);

	const [email] = useStorageState("email", sessionQueryResult?.data.email);

	const router = useRouter();

	const onSubmit = form.handleSubmit(async (data) => {
		await callBackendApi("@post/reset-password", {
			body: { ...data, email },

			onResponseError: (ctx) => {
				form.setError("code", { message: ctx.error.message });
			},

			onSuccess: () => {
				router.push("/dashboard");
			},
		});
	});

	return (
		<Main className="gap-13 px-4 pb-[158px]">
			<header className="flex flex-col gap-5">
				<h1 className="text-[36px] font-bold text-white">Reset Password</h1>
				<p className="text-[14px] text-white">
					Enter the 6-digit code sent to your email, as well your new password.
				</p>
			</header>

			<section>
				<Form.Root methods={form} className="gap-6" onSubmit={(event) => void onSubmit(event)}>
					<Form.Field control={form.control} name="code">
						<Form.Label className="text-white">Code</Form.Label>

						<Form.FieldController
							render={({ field }) => (
								<InputOTP.Root
									pattern={REGEXP_ONLY_DIGITS}
									maxLength={6}
									autoFocus={true}
									value={field.value}
									onChange={field.onChange}
								>
									<InputOTP.Group className="w-full justify-between gap-4 text-white">
										<For
											each={6}
											render={(item) => (
												<InputOTP.Slot
													key={item}
													index={item}
													classNames={{
														base: "size-11 border-2 border-white",
														isActive: "ring-cyberaware-unizik-orange",
													}}
												/>
											)}
										/>
									</InputOTP.Group>
								</InputOTP.Root>
							)}
						/>

						<Form.ErrorMessage />
					</Form.Field>

					<Form.Field control={form.control} name="new_password" className="mt-6">
						<Form.Label className="text-white">New Password</Form.Label>

						<Form.Input
							placeholder="Enter new password"
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

export default ResetPasswordPage;
