"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { use, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ProtectedMain } from "@/app/-components";
import { Show } from "@/components/common/show";
import { dashboardQuery, moduleQuizQuery } from "@/lib/react-query/queryOptions";
import { ModuleHeading } from "../../ModuleHeading";
import { QuizForm, QuizSchema } from "./QuizForm";
import { type ResultPayload, ResultView } from "./ResultView";

const shuffle = <TArray extends unknown[]>(array: TArray | undefined) => {
	if (!array) return;

	const shuffledArray = structuredClone(array);

	// == Using Fisher-Yates algorithm
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

	const [result, setResult] = useState<ResultPayload | null>(null);

	const form = useForm({
		defaultValues: [],
		resolver: zodResolver(QuizSchema),
	});

	const selectedQuizzes = useMemo(() => {
		return shuffle(moduleQuizQueryResult.data?.data)?.slice(0, 5);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [form, moduleQuizQueryResult.data?.data, result]);

	if (!selectedModule || isModuleLocked || !selectedQuizzes) {
		return null;
	}

	const onSubmit = form.handleSubmit((data) => {
		const details = data.map((answer) => {
			const selectedQuiz = selectedQuizzes.find((quiz) => quiz.question === answer.question);

			if (!selectedQuiz) {
				throw new Error("Quiz not found");
			}

			const isCorrect = answer.selected_option === selectedQuiz.correct_answer;

			return {
				question: selectedQuiz.question,
				options: selectedQuiz.options,
				userAnswer: answer.selected_option,
				correctAnswer: selectedQuiz.correct_answer,
				isCorrect,
			} satisfies ResultPayload["details"][number];
		});

		const score = details.reduce((accumulator, detail) => accumulator + (detail.isCorrect ? 1 : 0), 0);

		const percentage = Math.round((score / selectedQuizzes.length) * 100);

		const isPassed = percentage >= 80;

		setResult({ score, total: selectedQuizzes.length, percentage, isPassed, details });
	});

	const onRetake = () => {
		setResult(null);
		form.reset();
	};

	return (
		<ProtectedMain>
			<ModuleHeading
				selectedModule={selectedModule}
				totalModules={dashboardQueryResult.data?.total_modules}
			/>

			<section className="flex grow flex-col gap-[50px] bg-white px-5 pt-5 pb-[50px]">
				<hr className="h-px w-full border-none bg-cyberaware-neutral-gray-light" />

				<Show.Root when={!result}>
					<Show.Content>
						<QuizForm
							form={form}
							onSubmit={onSubmit}
							selectedModule={selectedModule}
							selectedQuizzes={selectedQuizzes}
						/>
					</Show.Content>

					<Show.Fallback>
						<ResultView
							nextModuleHref={`/dashboard/module/${Number(moduleId) + 1}`}
							result={result}
							onRetake={onRetake}
						/>
					</Show.Fallback>
				</Show.Root>
			</section>
		</ProtectedMain>
	);
}

export default QuizPage;
