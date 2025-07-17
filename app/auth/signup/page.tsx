"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@zayne-labs/ui-react/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Main } from "@/app/-components";
import { NavLink } from "@/components/common/NavLink";
import { Button } from "@/components/ui/button";

const SignupSchema = z.object({
	name: z.string().min(3, "Name must be at least 3 characters long"),
	email: z.email("Invalid email address"),
	password: z.string().min(8, "Password must be at least 8 characters long"),
});

function SignupPage() {
	const form = useForm({
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
		mode: "onTouched",
		resolver: zodResolver(SignupSchema),
	});

	const onSubmit = form.handleSubmit((data) => console.info({ data }));

	return (
		<Main className="gap-13 px-4 py-[158px]">
			<header className="flex flex-col gap-5">
				<h1 className="text-[36px] font-bold text-white">Create your Free Account </h1>
				<p className="text-[14px] text-white">
					Start learning how to stay safe online. It only takes a minute.
				</p>
				<p>
					Already have an account?{" "}
					<NavLink href="/auth/signin" className="text-white">
						Login
					</NavLink>
				</p>
			</header>

			<section>
				<Form.Root methods={form} className="gap-6" onSubmit={(event) => void onSubmit(event)}>
					<Form.Field control={form.control} name="name">
						<Form.Label className="text-white">Full name</Form.Label>
						<Form.Input
							placeholder="Enter full name"
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
								inputGroup: `h-[64px] border-2 border-cyberaware-neutral-gray-light px-8 text-white
								data-invalid:border-red-600`,
								input: "text-base text-white placeholder:text-white/50",
							}}
						/>

						<Form.ErrorMessage />
					</Form.Field>

					<Form.Submit asChild={true} className="mt-[42px]">
						<Button className="h-[64px] max-w-[260px] self-end">Create Account</Button>
					</Form.Submit>
				</Form.Root>
			</section>
		</Main>
	);
}

export default SignupPage;
