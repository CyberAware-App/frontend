"use client";

import { useRouter } from "@bprogress/next";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ProtectedMain } from "@/app/-components";
import { Show } from "@/components/common/show";
import { callBackendApiForQuery } from "@/lib/api/callBackendApi";
import { dashboardQuery, examQuery } from "@/lib/react-query/queryOptions";
import { shuffleArray } from "@/lib/utils/common";
import { AuthLoader } from "../../-components/AuthLoader";
import { Heading } from "../Heading";
import { ExamForm, ExamSchema } from "./ExamForm";
import { type ExamResultPayload, ExamResultView } from "./ExamResultView";

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
		resolver: zodResolver(ExamSchema),
	});

	const [result, setResult] = useState<ExamResultPayload | null>(null);

	const selectedExamQuestions = useMemo(() => {
		return shuffleArray(examQueryResult.data?.data)?.slice(0, 15);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [examQueryResult.data?.data, result]);

	if (isExamUnaccessible || !selectedExamQuestions) {
		return <AuthLoader text="Loading exam..." />;
	}

	const onSubmit = form.handleSubmit(async (data) => {
		await callBackendApiForQuery("@post/quiz", {
			body: data,
			onSuccess: (ctx) => setResult(ctx.data.data),
		});
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
					<ExamForm form={form} onSubmit={onSubmit} selectedExamQuestions={selectedExamQuestions} />

					<Show.Fallback>
						<ExamResultView result={result} onRetake={onRetake} />
					</Show.Fallback>
				</Show.Root>
			</section>
		</ProtectedMain>
	);
}

export default ExamPage;
