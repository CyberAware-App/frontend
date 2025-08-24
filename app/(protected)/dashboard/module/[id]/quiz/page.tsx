"use client";

import { ProtectedMain } from "@/app/-components";
import { For } from "@/components/common/for";
import { IconBox } from "@/components/common/IconBox";
import { DialogAnimated } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { apiSchema } from "@/lib/api/callBackendApi";
import { dashboardQuery, moduleQuizQuery } from "@/lib/react-query/queryOptions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import ModuleHeading from "../../ModuleHeading";

const QuizSchema = z
	.record(z.string(), apiSchema.routes["@post/quiz"].body.unwrap())
	.transform((data) => Object.values(data)) as unknown as (typeof apiSchema.routes)["@post/quiz"]["body"];

const shuffle = <TArray extends unknown[]>(array: TArray | undefined) => {
	if (!array) return [];

	const shuffledArray = structuredClone(array);

	// Fisher-Yates algorithm
	for (let lastElementIndex = shuffledArray.length - 1; lastElementIndex > 0; lastElementIndex--) {
		const randomIndex = Math.floor(Math.random() * (lastElementIndex + 1));

		[shuffledArray[lastElementIndex], shuffledArray[randomIndex]] = [
			shuffledArray[randomIndex],
			shuffledArray[lastElementIndex],
		];
	}

	return shuffledArray;
};

function QuizPage({ params }: PageProps<"/dashboard/module/[id]/quiz">) {
	const dashboardQueryResult = useQuery(dashboardQuery());

	const { id: moduleId } = use(params);

	const moduleQuizQueryResult = useQuery(moduleQuizQuery(moduleId));

	const selectedQuizzes = shuffle(moduleQuizQueryResult.data?.data).slice(0, 5);

	const selectedModule = dashboardQueryResult.data?.modules.find(
		(module) => String(module.id) === moduleId
	);

	const isModuleLocked = selectedModule?.status === "locked";

	const router = useRouter();

	useEffect(() => {
		if (isModuleLocked) {
			toast.error("You are not authorized to access this module quiz");

			router.push("/dashboard");
		}
	}, [isModuleLocked, router]);

	const form = useForm({
		defaultValues: [],
		resolver: zodResolver(QuizSchema),
	});

	if (isModuleLocked) {
		return null;
	}

	const onSubmit = form.handleSubmit((data) => console.info(data));

	return (
		<ProtectedMain>
			<ModuleHeading
				selectedModule={selectedModule}
				totalModules={dashboardQueryResult.data?.total_modules}
			/>

			<section className="flex grow flex-col gap-[50px] bg-white px-5 pt-5 pb-[50px]">
				<hr className="h-px w-full border-none bg-cyberaware-neutral-gray-light" />

				<article className="flex flex-col gap-10">
					<h3 className="text-[28px] font-semibold text-cyberaware-aeces-blue">
						{selectedModule?.title} Quiz:
					</h3>

					<Form.Root
						id="quiz-form"
						methods={form}
						onSubmit={(event) => void onSubmit(event)}
						className="gap-10"
					>
						<For
							each={selectedQuizzes}
							renderItem={(quiz, quizIndex) => (
								<Form.Field
									key={quiz.id}
									control={form.control}
									name={`${quizIndex}.question`}
									className="flex flex-col gap-5"
								>
									<Form.Label className="flex gap-1.5 text-cyberaware-aeces-blue">
										<span>{quizIndex + 1}.</span> <p>{quiz.question}</p>
									</Form.Label>

									<Form.Input hidden={true} type="text" value={quiz.question} />

									<Form.Field
										key={quiz.id}
										control={form.control}
										name={`${quizIndex}.selected_option`}
										className="ml-3"
									>
										<For
											each={Object.entries(quiz.options)}
											renderItem={([option, value]) => (
												<div
													className="flex items-center gap-2 text-cyberaware-aeces-blue"
													key={option}
												>
													<Form.Input
														id={value}
														type="radio"
														value={option}
														className="size-4 shrink-0 accent-cyberaware-aeces-blue"
													/>
													<label htmlFor={value}>{value}</label>
												</div>
											)}
										/>

										<Form.ErrorMessage />
									</Form.Field>
								</Form.Field>
							)}
						/>
					</Form.Root>
				</article>

				<DialogAnimated.Root>
					<article className="flex flex-col gap-7">
						<DialogAnimated.Trigger asChild={true}>
							<Button theme="orange" className="gap-2.5">
								Submit
								<IconBox icon="ri:brain-2-line" className="size-5" />
							</Button>
						</DialogAnimated.Trigger>

						<p className="text-[12px] font-medium text-cyberaware-aeces-blue">
							Your progress is saved automatically. You’ll unlock Day 2 after completing this quiz.
						</p>
					</article>

					<DialogAnimated.Content
						classNames={{
							base: `top-[70%] max-w-[367px] translate-y-[-70%] gap-[60px] rounded-none border-none
							px-5.5 pt-8 pb-[170px]`,
							overlay: "bg-[hsl(0,0%,85%)]/80",
						}}
						withCloseBtn={false}
					>
						<DialogAnimated.Header className="flex-row justify-center">
							<DialogAnimated.Title
								className="max-w-[240px] text-center text-[28px] font-semibold
									text-cyberaware-aeces-blue"
							>
								Are you sure you want to submit?
							</DialogAnimated.Title>
						</DialogAnimated.Header>

						<DialogAnimated.Footer className="flex-row gap-4">
							<DialogAnimated.Close asChild={true}>
								<Button theme="blue-ghost">Cancel</Button>
							</DialogAnimated.Close>

							<Form.Submit form="quiz-form" asChild={true}>
								<DialogAnimated.Close asChild={true}>
									<Button theme="orange" className="gap-2.5">
										Submit
										<IconBox icon="ri:brain-2-line" className="size-5" />
									</Button>
								</DialogAnimated.Close>
							</Form.Submit>
						</DialogAnimated.Footer>
					</DialogAnimated.Content>
				</DialogAnimated.Root>
			</section>
		</ProtectedMain>
	);
}

export default QuizPage;
