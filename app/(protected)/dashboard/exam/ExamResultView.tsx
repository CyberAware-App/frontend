import Image from "next/image";
import type { z } from "zod";
import { IconBox } from "@/components/common/IconBox";
import { NavLink } from "@/components/common/NavLink";
import { Switch } from "@/components/common/switch";
import { Button } from "@/components/ui/button";
import type { apiSchema } from "@/lib/api/callBackendApi";
import { cnJoin } from "@/lib/utils/cn";
import { emojiFailed, emojiPassed, emojiTooBad } from "@/public/assets";

export type ExamResultPayload = z.infer<(typeof apiSchema.routes)["@post/quiz"]["data"]>["data"];

type ExamResultViewProps = {
	maxAttempts: number;
	result: ExamResultPayload | null;
	onRetake: () => void;
};

function ExamResultView(props: ExamResultViewProps) {
	const { maxAttempts, result, onRetake } = props;

	if (!result) {
		return null;
	}

	const computedResultStatus = () => {
		if (result.passed) {
			return "passed";
		}

		if (result.attempt_number < maxAttempts) {
			return "pending";
		}

		return "exhausted";
	};

	const resultStatus = computedResultStatus();

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
						<Button theme="orange" className="gap-2.5" asChild={true}>
							<NavLink href="/dashboard/certificate">Get certificate</NavLink>
						</Button>
						<p className="text-center text-[12px] font-medium text-cyberaware-aeces-blue">
							You can go obtain your certificate
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
							Try again, You have {attemptsLeft} more chances.
						</p>
					</div>
				</Switch.Match>

				<Switch.Match when={resultStatus === "exhausted"}>
					<div className="flex flex-col items-center gap-6">
						<Button theme="danger" className="gap-2.5" asChild={true}>
							<NavLink href="/dashboard">Exit</NavLink>
						</Button>
						<p
							className="max-w-[305px] text-center text-[12px] font-medium
								text-cyberaware-aeces-blue"
						>
							You have exhausted all your chances and cannot continue with this programme
						</p>
					</div>
				</Switch.Match>
			</Switch.Root>
		</article>
	);
}

export { ExamResultView };
