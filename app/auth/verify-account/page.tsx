"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { For } from "@zayne-labs/ui-react/common/for";
import { Form } from "@zayne-labs/ui-react/ui/form";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Main } from "@/app/-components";
import { InputOTP } from "@/components/ui";
import { Button } from "@/components/ui/button";

const SignupSchema = z.object({
	code: z.string().min(6, "Invalid code").regex(new RegExp(REGEXP_ONLY_DIGITS), "Invalid code"),
});

function SignupPage() {
	const form = useForm({
		defaultValues: {
			code: "",
		},
		mode: "onTouched",
		resolver: zodResolver(SignupSchema),
	});

	const onSubmit = form.handleSubmit((data) => console.info({ data }));

	return (
		<Main className="relative gap-13 px-4 py-[158px]">
			<header className="flex flex-col gap-5">
				<h1 className="text-[36px] font-bold text-white">Verify Your Account</h1>
				<p className="text-[14px] text-white">Enter the 6-digit code sent to you@example.com.</p>
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
									// classNames={
									// 	{
									// 		// container:
									// 		// 	"[&>div]:text-[25px] [&>div]:[-webkit-text-security:disc]",
									// 	}
									// }
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
													}}
												/>
											)}
										/>
									</InputOTP.Group>
								</InputOTP.Root>
							)}
						/>
					</Form.Field>

					<p className="mt-[42px]">
						Didn’t get a code?{" "}
						<Button unstyled={true} className="font-semibold text-white">
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

export default SignupPage;
