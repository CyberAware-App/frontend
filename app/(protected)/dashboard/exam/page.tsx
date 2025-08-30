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
import { ProtectedMain } from "@/app/-components";
import { Switch } from "@/components/common/switch";
import { callBackendApiForQuery } from "@/lib/api/callBackendApi";
import { certificateQuery, dashboardQuery, examQuery, sessionQuery } from "@/lib/react-query/queryOptions";
import { shuffleArray } from "@/lib/utils/common";
import { LoadingScreen } from "../../../-components/LoadingScreen";
import { Heading } from "../Heading";
import { ExamCertSuccess } from "./ExamCertSuccess";
import { ExamForm, ExamFormSchema } from "./ExamForm";
import { ExamGuidelines } from "./ExamGuidelines";
import { type ExamResultPayload, ExamResultView, type ResultStatus } from "./ExamResultView";

const MAX_QUESTIONS = 50;

const EXAM_DURATION = 35 * 60 * 1000;

function ExamPage() {
	const sessionQueryResult = useQuery(sessionQuery());

	const router = useRouter();

	const dashboardQueryResult = useQuery(dashboardQuery());

	const isCertified = sessionQueryResult.data?.is_certified;

	const isExamUnaccessible =
		Boolean(dashboardQueryResult.data) && dashboardQueryResult.data.completed_modules_count !== 10;

	const examQueryResult = useQuery(
		examQuery({
			router,
			isCertified,
			isUnaccessible: isExamUnaccessible,
		})
	);

	const [isSubmittingOnTimeUp, toggleSubmittingOnTimeUp] = useToggle(false);

	const form = useForm({
		defaultValues: [],
		resolver: zodResolver(ExamFormSchema),
	});

	const [result, setResult] = useState<ExamResultPayload | null>(null);

	const selectedExamQuestions = useMemo(() => {
		return shuffleArray(examQueryResult.data?.exam_data)?.slice(0, MAX_QUESTIONS);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [examQueryResult.data, examQueryResult.isRefetching]);

	const queryClient = useQueryClient();

	const [shouldDisplayWarning, toggleShouldDisplayWarning] = useToggle(true);

	if (isCertified) {
		return <ExamCertSuccess />;
	}

	if (examQueryResult.isRefetching) {
		return <LoadingScreen text="Retaking exam..." />;
	}

	if (isExamUnaccessible || !selectedExamQuestions) {
		return <LoadingScreen text="Loading exam..." />;
	}

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
		void queryClient.refetchQueries(examQuery());
	};

	const maxAttempts = Number(examQueryResult.data?.max_attempts);

	const computedResultStatus = (): ResultStatus => {
		if (result && result.attempt_number >= maxAttempts) {
			return "exhausted";
		}

		if (result?.passed) {
			return "passed";
		}

		return "pending";
	};

	const resultStatus = computedResultStatus();

	const isSubmitting = isSubmittingOnTimeUp || form.formState.isSubmitting;

	return (
		<ProtectedMain>
			<Heading />

			<section className="flex grow flex-col gap-[50px] bg-white px-5 pt-5 pb-[50px]">
				<hr className="h-px w-full border-none bg-cyberaware-neutral-gray-light" />

				<Switch.Root>
					<Switch.Match when={shouldDisplayWarning}>
						<ExamGuidelines onProceed={() => toggleShouldDisplayWarning(false)} />
					</Switch.Match>

					<Switch.Match when={result}>
						{(definedResult) => (
							<ExamResultView
								result={definedResult}
								resultStatus={resultStatus}
								maxAttempts={maxAttempts}
								onRetake={onRetake}
							/>
						)}
					</Switch.Match>

					<Switch.Match when={resultStatus !== "exhausted"}>
						<ExamForm
							form={form}
							isSubmitting={isSubmitting}
							examDuration={EXAM_DURATION}
							onTimeUp={onTimeUp}
							onSubmit={onSubmit}
							selectedExamQuestions={selectedExamQuestions}
						/>
					</Switch.Match>
				</Switch.Root>
			</section>
		</ProtectedMain>
	);
}

export default ExamPage;
