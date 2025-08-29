"use client";

import { useRouter } from "@bprogress/next";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@zayne-labs/ui-react/ui/form";
import { useForm } from "react-hook-form";
import { Main } from "@/app/-components";
import { NavLink } from "@/components/common/NavLink";
import { Button } from "@/components/ui/button";
import { apiSchema, callBackendApiForQuery } from "@/lib/api/callBackendApi";

const SignupSchema = apiSchema.routes["@post/register"].body;

function SignupPage() {
	const form = useForm({
		defaultValues: {
			email: "",
			first_name: "",
			last_name: "",
			password: "",
		},
		mode: "onTouched",
		resolver: zodResolver(SignupSchema),
	});

	const router = useRouter();

	const onSubmit = form.handleSubmit(async (data) => {
		await callBackendApiForQuery("@post/register", {
			body: data,
			meta: { auth: { skipHeaderAddition: true } },

			onResponseError: (ctx) => {
				for (const [key, value] of Object.entries(ctx.error.errorData.errors ?? {})) {
					form.setError(key as never, { message: value });
				}
			},

			onSuccess: () => {
				localStorage.setItem("email", data.email);

				router.push("/auth/verify-account");
			},
		});
	});

	return (
		<Main className="gap-13 px-4 pb-[158px]">
			<header className="flex flex-col gap-5">
				<h1 className="text-[36px] font-bold text-white">Create your Free Account </h1>
				<p className="text-[14px] text-white">
					Start learning how to stay safe online. It only takes a minute.
				</p>
				<p className="flex gap-1">
					<span className="text-cyberaware-neutral-gray-light/50">Already have an account?</span>
					<NavLink href="/auth/signin" className="text-cyberaware-primary-blue-light">
						Login
					</NavLink>
				</p>
			</header>

			<section>
				<Form.Root methods={form} className="gap-6" onSubmit={(event) => void onSubmit(event)}>
					<Form.Field control={form.control} name="first_name">
						<Form.Label className="text-white">First name</Form.Label>
						<Form.Input
							placeholder="Enter first name"
							className="h-[64px] border-2 border-cyberaware-neutral-gray-light px-8 text-base
								text-white placeholder:text-white/50 data-invalid:border-red-600"
						/>

						<Form.ErrorMessage />
					</Form.Field>

					<Form.Field control={form.control} name="last_name">
						<Form.Label className="text-white">Last name</Form.Label>
						<Form.Input
							placeholder="Enter last name"
							className="h-[64px] border-2 border-cyberaware-neutral-gray-light px-8 text-base
								text-white placeholder:text-white/50 data-invalid:border-red-600"
						/>

						<Form.ErrorMessage />
					</Form.Field>

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
					</Form.Field>

					<Form.Submit asChild={true} className="mt-[42px]">
						<Button
							isLoading={form.formState.isSubmitting}
							isDisabled={form.formState.isSubmitting}
							className="h-[64px] max-w-[260px] self-end"
						>
							Create Account
						</Button>
					</Form.Submit>
				</Form.Root>
			</section>
		</Main>
	);
}

export default SignupPage;
