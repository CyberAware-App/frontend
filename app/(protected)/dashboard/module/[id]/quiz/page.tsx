"use client";

import { useRouter } from "@bprogress/next";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { use, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Main } from "@/app/-components";
import { LoadingScreen } from "@/app/-components/LoadingScreen";
import { Switch } from "@/components/common/switch";
import { dashboardQuery, moduleQuizQuery } from "@/lib/react-query/queryOptions";
import { shuffleArray } from "@/lib/utils/common";
import { DashboardHeading } from "../../../DashboardHeading";
import { ExamFormSchema } from "../../../exam/ExamForm";
import { QuizForm } from "./QuizForm";
import { type QuizResultPayload, QuizResultView } from "./QuizResultView";

const MAX_QUESTION = 5;

function QuizPage({ params }: PageProps<"/dashboard/module/[id]/quiz">) {
	const dashboardQueryResult = useQuery(dashboardQuery());

	const { id: moduleId } = use(params);

	const selectedModule = dashboardQueryResult.data?.modules.find(
		(module) => String(module.id) === moduleId
	);

	const isQuizUnaccessible = Boolean(selectedModule && selectedModule.status === "locked");

	const router = useRouter();

	const moduleQuizQueryResult = useQuery(
		moduleQuizQuery({
			moduleId,
			router,
			isUnaccessible: isQuizUnaccessible,
		})
	);

	const [result, setResult] = useState<QuizResultPayload | null>();

	const form = useForm({
		defaultValues: [],
		resolver: zodResolver(ExamFormSchema),
	});

	const shouldReshuffleQuestions = Boolean(result);

	const selectedQuizQuestions = useMemo(() => {
		return shuffleArray(moduleQuizQueryResult.data)?.slice(0, MAX_QUESTION);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [moduleQuizQueryResult.data, shouldReshuffleQuestions]);

	const onSubmit = form.handleSubmit((data) => {
		if (!selectedQuizQuestions) return;

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
		<Main>
			<DashboardHeading />

			<section className="flex grow flex-col gap-[50px] bg-white px-5 pt-5 pb-[50px]">
				<hr className="h-px w-full border-none bg-cyberaware-neutral-gray-light" />

				<Switch.Root>
					<Switch.Match when={isQuizUnaccessible}>
						<LoadingScreen text="Loading quiz..." />
					</Switch.Match>

					<Switch.Match when={result}>
						{(definedResult) => (
							<QuizResultView
								nextModuleHref={`/dashboard/module/${Number(moduleId) + 1}`}
								result={definedResult}
								onRetake={onRetake}
							/>
						)}
					</Switch.Match>

					<Switch.Match when={selectedQuizQuestions}>
						{(definedSelectedQuizQuestions) => (
							<QuizForm
								form={form}
								onSubmit={onSubmit}
								selectedModule={selectedModule}
								selectedQuizQuestions={definedSelectedQuizQuestions}
							/>
						)}
					</Switch.Match>

					<Switch.Default>
						<LoadingScreen text="Loading quiz..." />
					</Switch.Default>
				</Switch.Root>
			</section>
		</Main>
	);
}

export default QuizPage;
