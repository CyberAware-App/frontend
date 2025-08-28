"use client";

import { useRouter } from "@bprogress/next";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { use, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { ProtectedMain } from "@/app/-components";
import { AuthLoader } from "@/app/(protected)/-components/AuthLoader";
import { Show } from "@/components/common/show";
import { dashboardQuery, moduleQuizQuery } from "@/lib/react-query/queryOptions";
import { shuffleArray } from "@/lib/utils/common";
import { ExamFormSchema } from "../../../exam/ExamForm";
import { Heading } from "../../../Heading";
import { QuizForm } from "./QuizForm";
import { type QuizResultPayload, QuizResultView } from "./QuizResultView";

const MAX_QUESTION = 5;

function QuizPage({ params }: PageProps<"/dashboard/module/[id]/quiz">) {
	const dashboardQueryResult = useQuery(dashboardQuery());

	const { id: moduleId } = use(params);

	const selectedModule = dashboardQueryResult.data?.modules.find(
		(module) => String(module.id) === moduleId
	);

	const isQuizUnaccessible = selectedModule && selectedModule.status === "locked";

	const router = useRouter();

	const moduleQuizQueryResult = useQuery(
		moduleQuizQuery({ moduleId, router, isUnaccessible: isQuizUnaccessible })
	);

	const [result, setResult] = useState<QuizResultPayload | null>(null);

	const form = useForm({
		defaultValues: [],
		resolver: zodResolver(ExamFormSchema),
	});

	const selectedQuizQuestions = useMemo(() => {
		return shuffleArray(moduleQuizQueryResult.data)?.slice(0, MAX_QUESTION);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [moduleQuizQueryResult.data, result]);

	if (!selectedModule || isQuizUnaccessible || !selectedQuizQuestions) {
		return <AuthLoader text="Loading quiz..." />;
	}

	const onSubmit = form.handleSubmit((data) => {
		const details = data.map((answer) => {
			const selectedQuiz = selectedQuizQuestions.find((quiz) => quiz.question === answer.question);

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
			} satisfies QuizResultPayload["details"][number];
		});

		const score = details.reduce((accumulator, detail) => accumulator + (detail.isCorrect ? 1 : 0), 0);

		const percentage = Math.round((score / selectedQuizQuestions.length) * 100);

		const isPassed = percentage >= 80;

		setResult({ score, total: selectedQuizQuestions.length, percentage, isPassed, details });
	});

	const onRetake = () => {
		setResult(null);
		form.reset();
	};

	return (
		<ProtectedMain>
			<Heading />

			<section className="flex grow flex-col gap-[50px] bg-white px-5 pt-5 pb-[50px]">
				<hr className="h-px w-full border-none bg-cyberaware-neutral-gray-light" />

				<Show.Root when={!result}>
					<QuizForm
						form={form}
						onSubmit={onSubmit}
						selectedModule={selectedModule}
						selectedQuizQuestions={selectedQuizQuestions}
					/>

					<Show.Fallback>
						<QuizResultView
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
