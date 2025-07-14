"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@zayne-labs/ui-react/ui/form";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Main } from "@/app/-components";
import { Button } from "@/components/ui/button";

const SigninSchema = z.object({
	email: z.email("Invalid email address"),
	password: z.string().min(8, "Password must be at least 8 characters long"),
});

function SigninPage() {
	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		mode: "onTouched",
		resolver: zodResolver(SigninSchema),
	});

	const onSubmit = form.handleSubmit((data) => console.info({ data }));

	return (
		<Main className="relative gap-13 px-4 py-[158px]">
			<header className="flex flex-col gap-5">
				<h1 className="text-[36px] font-bold text-white">Welcome Back </h1>
				<p className="text-[14px] text-white">Log In to continue your 10-day cybersecurity Journey</p>
				<p>
					Don't have an Account?{" "}
					<Link href="/auth/signup" className="text-white">
						Create one
					</Link>
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
								inputGroup: `h-[64px] border-2 border-cyberaware-neutral-gray-light px-8
								data-invalid:border-red-600`,
								input: "text-base text-white placeholder:text-white/50",
							}}
						/>

						<Form.ErrorMessage />
					</Form.Field>

					<Form.Submit asChild={true} className="mt-[42px]">
						<Button className="h-[64px] max-w-[260px] self-end">Log In</Button>
					</Form.Submit>
				</Form.Root>
			</section>
		</Main>
	);
}

export default SigninPage;
