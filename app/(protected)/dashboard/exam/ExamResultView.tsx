"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import type { z } from "zod";
import { IconBox } from "@/components/common/IconBox";
import { NavLink } from "@/components/common/NavLink";
import { Switch } from "@/components/common/switch";
import { Button } from "@/components/ui/button";
import type { apiSchema } from "@/lib/api/callBackendApi";
import { certificateQuery } from "@/lib/react-query/queryOptions";
import { useDownloadCertificate } from "@/lib/react-query/useDownloadCertificate";
import { cnJoin } from "@/lib/utils/cn";
import { emojiFailed, emojiPassed, emojiTooBad } from "@/public/assets";

export type ExamResultPayload = z.infer<(typeof apiSchema.routes)["@post/quiz"]["data"]>["data"];

export type ResultStatus = "passed" | "pending" | "exhausted";

type ExamResultViewProps = {
	maxAttempts: number;
	result: ExamResultPayload;
	onRetake: () => void;
};

function ExamResultView(props: ExamResultViewProps) {
	const { maxAttempts, result, onRetake } = props;

	const computedResultStatus = (): ResultStatus => {
		if (result.attempt_number >= maxAttempts) {
			return "exhausted";
		}

		if (result.passed) {
			return "passed";
		}

		return "pending";
	};

	const resultStatus = computedResultStatus();

	const certificateQueryResult = useQuery(certificateQuery());

	const certificateId = certificateQueryResult.data?.certificate_id;

	const { downloadCertificate, isFetching } = useDownloadCertificate(certificateId);

	const emojiMap = {
		passed: emojiPassed,
		pending: emojiFailed,
		exhausted: emojiTooBad,
	} satisfies Record<typeof resultStatus, string>;

	const attemptsLeft = maxAttempts - result.attempt_number;

	return (
		<article className="flex flex-col gap-10 pb-[100px]">
			<div className="flex flex-col items-center gap-3 text-cyberaware-aeces-blue">
				<Image src={emojiMap[resultStatus]} alt="" className="size-[96px] object-cover" />

				<h3 className="text-[28px] font-semibold">You scored:</h3>

				<p className="flex gap-0.5 text-[28px] font-semibold">
					<span
						className={cnJoin(
							resultStatus === "passed" ?
								"text-cyberaware-success-green"
							:	"text-cyberaware-danger-red"
						)}
					>
						{result.correct_answers}
					</span>
					/<span>{result.total_questions}</span>
				</p>
			</div>

			<Switch.Root>
				<Switch.Match when={resultStatus === "passed"}>
					<div className="flex flex-col items-center gap-6">
						<Button
							theme="orange"
							className="gap-2.5"
							isLoading={isFetching}
							isDisabled={isFetching}
							onClick={() => downloadCertificate()}
						>
							Download certificate
						</Button>
						<p className="text-center text-[12px] font-medium text-cyberaware-aeces-blue">
							You can click to download your certificate
						</p>
					</div>
				</Switch.Match>

				<Switch.Match when={resultStatus === "pending"}>
					<div className="flex flex-col items-center gap-6">
						<Button theme="orange" onClick={onRetake} className="gap-2.5">
							Retake Quiz
							<IconBox icon="ri:brain-2-line" className="size-5" />
						</Button>

						<p className="text-center text-[12px] font-medium text-cyberaware-aeces-blue">
							Try again, You have{" "}
							<span className="font-semibold text-cyberaware-danger-red">{attemptsLeft}</span> more{" "}
							{attemptsLeft === 1 ? "attempt" : "attempts"} left.
						</p>
					</div>
				</Switch.Match>

				<Switch.Match when={resultStatus === "exhausted"}>
					<div className="flex flex-col items-center gap-6">
						<Button theme="danger" className="gap-2.5" asChild={true}>
							<NavLink href="/dashboard">Exit</NavLink>
						</Button>

						<div>
							<p
								className="max-w-[305px] text-center text-[12px] font-medium
									text-cyberaware-aeces-blue"
							>
								You've used all available attempts for this program and hence cannot continue.
							</p>
							<p
								className="max-w-[305px] text-center text-[12px] font-medium
									text-cyberaware-aeces-blue"
							>
								For assistance or to request a progress reset, please contact our support team.
							</p>
						</div>
					</div>
				</Switch.Match>
			</Switch.Root>
		</article>
	);
}

export { ExamResultView };
