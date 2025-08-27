"use client";

import { useRouter } from "@bprogress/next";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ProtectedMain } from "@/app/-components";
import { Show } from "@/components/common/show";
import { callBackendApiForQuery } from "@/lib/api/callBackendApi";
import { certificateQuery, dashboardQuery, examQuery } from "@/lib/react-query/queryOptions";
import { shuffleArray } from "@/lib/utils/common";
import { AuthLoader } from "../../-components/AuthLoader";
import { Heading } from "../Heading";
import { ExamForm, ExamFormSchema } from "./ExamForm";
import { type ExamResultPayload, ExamResultView, type ResultStatus } from "./ExamResultView";

function ExamPage() {
	const dashboardQueryResult = useQuery(dashboardQuery());

	const router = useRouter();

	const examQueryResult = useQuery(examQuery(router));

	const isExamUnaccessible =
		dashboardQueryResult.data && dashboardQueryResult.data.completed_modules_count !== 10;

	useEffect(() => {
		if (isExamUnaccessible) {
			toast.error("You are not authorized to access this exam");

			router.push("/dashboard");
		}
	}, [isExamUnaccessible, router]);

	const form = useForm({
		defaultValues: [],
		resolver: zodResolver(ExamFormSchema),
	});

	const [result, setResult] = useState<ExamResultPayload | null>(null);

	const selectedExamQuestions = useMemo(() => {
		return shuffleArray(examQueryResult.data?.exam_data)?.slice(0, 50);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [examQueryResult.data, result]);

	const queryClient = useQueryClient();

	if (isExamUnaccessible || !selectedExamQuestions) {
		return <AuthLoader text="Loading exam..." />;
	}

	const onSubmit = form.handleSubmit(async (data) => {
		await callBackendApiForQuery("@post/quiz", {
			body: data,
			meta: { toast: { success: false } },

			onSuccess: (ctx) => {
				setResult(ctx.data.data);
				void queryClient.refetchQueries(certificateQuery());
			},
		});
	});

	const onRetake = () => {
		setResult(null);
		form.reset();
	};

	const maxAttempts = examQueryResult.data?.max_attempts ?? 5;

	const computedResultStatus = (): ResultStatus => {
		if (result && result.attempt_number > maxAttempts) {
			return "exhausted";
		}

		if (result?.passed) {
			return "passed";
		}

		return "pending";
	};

	const resultStatus = computedResultStatus();

	return (
		<ProtectedMain>
			<Heading />

			<section className="flex grow flex-col gap-[50px] bg-white px-5 pt-5 pb-[50px]">
				<hr className="h-px w-full border-none bg-cyberaware-neutral-gray-light" />

				<Show.Root when={!result && resultStatus !== "exhausted"}>
					<Show.Content>
						<ExamForm
							form={form}
							onSubmit={onSubmit}
							selectedExamQuestions={selectedExamQuestions}
						/>
					</Show.Content>

					<Show.Fallback>
						<ExamResultView
							result={result}
							resultStatus={resultStatus}
							maxAttempts={maxAttempts}
							onRetake={onRetake}
						/>
					</Show.Fallback>
				</Show.Root>
			</section>
		</ProtectedMain>
	);
}

export default ExamPage;
