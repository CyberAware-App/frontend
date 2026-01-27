"use client";

import { useRouter } from "@bprogress/next";
import { zodResolver } from "@hookform/resolvers/zod";
import { useStorageState } from "@zayne-labs/toolkit-react";
import { For } from "@zayne-labs/ui-react/common/for";
import { Form } from "@zayne-labs/ui-react/ui/form";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useForm } from "react-hook-form";
import { Main } from "@/app/-components";
import { InputOTP } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { apiSchema, callBackendApiForQuery } from "@/lib/api/callBackendApi";
import { authTokenStore } from "@/lib/api/callBackendApi/plugins/utils";
import { usePageBlocker } from "@/lib/hooks";
import { resendOtp } from "./utils";

const VerifyAccountSchema = apiSchema.routes["@post/verify-otp"].body.pick({ code: true });

function VerifyAccountPage() {
	const router = useRouter();

	const [email] = useStorageState<string | null>("email", null);

	usePageBlocker({
		condition: !email,
		message: "Email not provided",
		redirectPath: "/auth/signin",
	});

	const form = useForm({
		defaultValues: {
			code: "",
		},
		mode: "onTouched",
		resolver: zodResolver(VerifyAccountSchema),
	});

	if (!email) {
		return null;
	}

	const onSubmit = form.handleSubmit(async (data) => {
		await callBackendApiForQuery("@post/verify-otp", {
			body: { code: data.code, email },
			meta: { auth: { skipHeaderAddition: true } },

			onResponseError: (ctx) => {
				form.setError("code", { message: ctx.error.errorData.errors?.code });
			},

			onSuccess: (ctx) => {
				authTokenStore.setTokens({
					access: ctx.data.data.access,
					refresh: ctx.data.data.refresh,
				});

				router.push("/dashboard");
			},
		});
	});

	return (
		<Main className="gap-13 px-4 pb-[158px]">
			<header className="flex flex-col gap-5">
				<h1 className="text-[36px] font-bold text-white">Verify Your Account</h1>
				<p className="truncate text-[14px] text-white">Enter the 6-digit code sent to your email.</p>
			</header>

			<section>
				<Form.Root form={form} className="gap-6" onSubmit={(event) => void onSubmit(event)}>
					<Form.Field control={form.control} name="code">
						<Form.FieldBoundController
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
											renderItem={(item) => (
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

					<p className="mt-[42px]">
						Didn’t get a code?{" "}
						<Button
							unstyled={true}
							className="font-semibold text-white"
							onClick={() => {
								resendOtp(email);
								form.reset();
							}}
						>
							Request again
						</Button>
					</p>

					<Form.Submit asChild={true} className="mt-[64px]">
						<Button className="h-[64px]">Verify & Continue</Button>
					</Form.Submit>
				</Form.Root>
			</section>
		</Main>
	);
}

export default VerifyAccountPage;
