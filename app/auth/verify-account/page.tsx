"use client";

import { useRouter } from "@bprogress/next";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { pickKeys } from "@zayne-labs/toolkit-core";
import { useStorageState } from "@zayne-labs/toolkit-react";
import { For } from "@zayne-labs/ui-react/common/for";
import { Form } from "@zayne-labs/ui-react/ui/form";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useForm } from "react-hook-form";
import { Main } from "@/app/-components";
import { InputOTP } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { apiSchema, callBackendApi } from "@/lib/api/callBackendApi";
import { sessionQuery } from "@/lib/api/queryOptions";
import { resendOtp } from "./utils";

const VerifyAccountSchema = apiSchema.routes["/verify-otp"].body.pick({ code: true });

function VerifyAccountPage() {
	const form = useForm({
		defaultValues: {
			code: "",
		},
		mode: "onTouched",
		resolver: zodResolver(VerifyAccountSchema),
	});

	const queryClient = useQueryClient();

	const sessionQueryResult = queryClient.getQueryData(sessionQuery().queryKey);

	const [email] = useStorageState("email", sessionQueryResult?.data.email);

	const router = useRouter();

	const onSubmit = form.handleSubmit(async (data) => {
		await callBackendApi("/verify-otp", {
			body: {
				code: data.code,
				email,
			},

			method: "POST",

			onResponseError: (ctx) => {
				form.setError("code", { message: ctx.error.errorData.errors.code });
			},

			onSuccess: (ctx) => {
				localStorage.setItem("accessToken", ctx.data.data.access);
				localStorage.setItem("refreshToken", ctx.data.data.refresh);

				queryClient.setQueryData(sessionQuery().queryKey, (oldData) => ({
					...(oldData as NonNullable<typeof oldData>),
					data: {
						...(oldData?.data as NonNullable<typeof oldData>["data"]),
						...pickKeys(ctx.data.data, ["email", "first_name"]),
					},
				}));

				router.push("/dashboard");
			},
		});
	});

	return (
		<Main className="gap-13 px-4 pb-[158px]">
			<header className="flex flex-col gap-5">
				<h1 className="text-[36px] font-bold text-white">Verify Your Account</h1>
				<p className="truncate text-[14px] text-white">Enter the 6-digit code sent to {email}.</p>
			</header>

			<section>
				<Form.Root methods={form} className="gap-6" onSubmit={(event) => void onSubmit(event)}>
					<Form.Field control={form.control} name="code">
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
													classNames={{ base: "size-11 border-2 border-white" }}
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
							onClick={() => void resendOtp(email)}
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
