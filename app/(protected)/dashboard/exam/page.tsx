"use client";

import { useRouter } from "@bprogress/next";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { defineSchemaConfig } from "@zayne-labs/callapi";
import { useToggle } from "@zayne-labs/toolkit-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { Main } from "@/app/-components";
import { Switch } from "@/components/common/switch";
import { callBackendApiForQuery } from "@/lib/api/callBackendApi";
import { certificateQuery, dashboardQuery, examQuery, sessionQuery } from "@/lib/react-query/queryOptions";
import { shuffleArray } from "@/lib/utils/common";
import { LoadingScreen } from "../../../-components/LoadingScreen";
import { withProtection } from "../../-components/withProtection";
import { DashboardHeading } from "../DashboardHeading";
import { ExamCertSuccess } from "./ExamCertSuccess";
import { ExamForm, ExamFormSchema } from "./ExamForm";
import { ExamGuidelines } from "./ExamGuidelines";
import { type ExamResultPayload, ExamResultView } from "./ExamResultView";

const MAX_QUESTIONS = 50;

const EXAM_DURATION = 35 * 60 * 1000;

function ExamPage() {
	const sessionQueryResult = useQuery(sessionQuery());

	const router = useRouter();

	const dashboardQueryResult = useQuery(dashboardQuery());

	const isCertified = sessionQueryResult.data?.is_certified;

	const isExamUnaccessible =
		Boolean(dashboardQueryResult.data) && dashboardQueryResult.data.completed_modules_count !== 10;

	const examQueryInstance = examQuery({
		router,
		isCertified,
		isUnaccessible: isExamUnaccessible,
	});

	const examQueryResult = useQuery(examQueryInstance);

	const [isSubmittingOnTimeUp, toggleSubmittingOnTimeUp] = useToggle(false);

	const form = useForm({
		defaultValues: [],
		resolver: zodResolver(ExamFormSchema),
	});

	const [result, setResult] = useState<ExamResultPayload | null>(null);

	const shouldReshuffleQuestions = examQueryResult.isRefetching;

	const selectedExamQuestions = useMemo(() => {
		return shuffleArray(examQueryResult.data?.exam_data)?.slice(0, MAX_QUESTIONS);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [examQueryResult.data, shouldReshuffleQuestions]);

	const queryClient = useQueryClient();

	const [shouldShowGuidelines, toggleShouldShowGuidelines] = useToggle(true);

	const uploadAnswers = async (data: z.infer<typeof ExamFormSchema>) => {
		await callBackendApiForQuery("@post/quiz", {
			body: data,
			meta: { toast: { success: false } },

			schemaConfig: defineSchemaConfig((ctx) => ({
				...ctx.baseSchemaConfig,
				disableRuntimeValidation: true,
			})),

			onError: () => {
				toggleSubmittingOnTimeUp(false);
			},

			onSuccess: (ctx) => {
				toggleSubmittingOnTimeUp(false);
				setResult(ctx.data.data);
				void queryClient.refetchQueries(certificateQuery());
			},
		});
	};

	const onSubmit = form.handleSubmit(async (data) => {
		await uploadAnswers(data);
	});

	const onTimeUp = () => {
		toast.error("Exam time elapsed! Submitting your answers...");

		toggleSubmittingOnTimeUp(true);

		void uploadAnswers(
			Object.values(form.getValues()).map((item) => ({
				...item,
				// eslint-disable-next-line ts-eslint/no-unnecessary-condition
				selected_option: item.selected_option || "",
			}))
		);
	};

	const onRetake = () => {
		setResult(null);
		form.reset();
		void queryClient.refetchQueries(examQueryInstance);
	};

	const maxAttempts = Number(examQueryResult.data?.max_attempts);

	const isSubmitting = isSubmittingOnTimeUp || form.formState.isSubmitting;

	return (
		<Main>
			<DashboardHeading />

			<section className="flex grow flex-col gap-[50px] bg-white px-5 pt-5 pb-[50px]">
				<hr className="h-px w-full border-none bg-cyberaware-neutral-gray-light" />

				<Switch.Root>
					<Switch.Match when={isExamUnaccessible}>
						<LoadingScreen text="Loading exam..." />
					</Switch.Match>

					<Switch.Match when={examQueryResult.isRefetching}>
						<LoadingScreen text="Retaking exam..." />
					</Switch.Match>

					<Switch.Match when={isCertified}>
						<ExamCertSuccess />
					</Switch.Match>

					<Switch.Match when={shouldShowGuidelines}>
						<ExamGuidelines
							onProceed={() => {
								toggleShouldShowGuidelines(false);
								window.scrollTo({ behavior: "smooth", top: 0 });
							}}
						/>
					</Switch.Match>

					<Switch.Match when={result}>
						{(definedResult) => (
							<ExamResultView
								result={definedResult}
								maxAttempts={maxAttempts}
								onRetake={onRetake}
							/>
						)}
					</Switch.Match>

					<Switch.Match when={selectedExamQuestions}>
						{(definedSelectedExamQuestions) => (
							<ExamForm
								form={form}
								isSubmitting={isSubmitting}
								examDuration={EXAM_DURATION}
								onTimeUp={onTimeUp}
								onSubmit={onSubmit}
								selectedExamQuestions={definedSelectedExamQuestions}
							/>
						)}
					</Switch.Match>

					<Switch.Default>
						<LoadingScreen text="Loading exam..." />
					</Switch.Default>
				</Switch.Root>
			</section>
		</Main>
	);
}

export default withProtection(ExamPage);
