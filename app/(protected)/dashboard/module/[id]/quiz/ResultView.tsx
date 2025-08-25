import Image from "next/image";
import { ForWithWrapper } from "@/components/common/for";
import { IconBox } from "@/components/common/IconBox";
import { NavLink } from "@/components/common/NavLink";
import { Show } from "@/components/common/show";
import { Button } from "@/components/ui/button";
import type { SelectedQuizzes } from "@/lib/react-query/queryOptions";
import { cnJoin } from "@/lib/utils/cn";
import { emojiFailed, emojiPassed } from "@/public/assets";

export type ResultDetail = {
	question: string | undefined;
	options: SelectedQuizzes[number]["options"];
	userAnswer: SelectedQuizzes[number]["correct_answer"];
	correctAnswer: SelectedQuizzes[number]["correct_answer"];
	isCorrect: boolean;
};

export type ResultPayload = {
	score: number;
	total: number;
	percentage: number;
	isPassed: boolean;
	details: ResultDetail[];
};

type ResultViewProps = {
	result: ResultPayload | null;
	onRetake: () => void;
};

function ResultView(props: ResultViewProps) {
	const { result, onRetake } = props;

	if (!result) {
		return null;
	}

	return (
		<article className="flex flex-col gap-10">
			<div className="flex flex-col items-center gap-3 text-cyberaware-aeces-blue">
				<Image
					src={result.isPassed ? emojiPassed : emojiFailed}
					alt=""
					className="size-[96px] object-cover"
				/>

				<h3 className="text-[28px] font-semibold">You scored:</h3>

				<p className="flex gap-0.5 text-[28px] font-semibold">
					<span
						className={cnJoin(
							result.isPassed ? "text-cyberaware-success-green" : "text-cyberaware-danger-red"
						)}
					>
						{result.score}
					</span>
					/<span>{result.total}</span>
				</p>
			</div>

			<ForWithWrapper
				className="flex flex-col gap-4"
				each={result.details}
				renderItem={(detail) => (
					<li
						key={detail.question}
						className={cnJoin(
							"rounded-lg border-2 p-4",
							detail.isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
						)}
					>
						<div className="flex gap-3">
							<span
								className={cnJoin(
									"mt-1 size-5 shrink-0",
									detail.isCorrect ?
										"text-cyberaware-success-green"
									:	"text-cyberaware-danger-red"
								)}
							>
								<IconBox
									icon={
										detail.isCorrect ? "mdi:check-circle-outline" : "mdi:close-circle-outline"
									}
									className="size-full"
								/>
							</span>

							<div className="flex flex-col gap-2">
								<h4 className="font-semibold text-cyberaware-aeces-blue">{detail.question}</h4>

								<div className="text-sm">
									<p
										className={cnJoin(
											detail.isCorrect ?
												"text-cyberaware-success-green"
											:	"text-cyberaware-danger-red"
										)}
									>
										<span className="font-semibold">Your answer:</span>{" "}
										{detail.options[detail.userAnswer]} ({detail.userAnswer})
									</p>

									{!detail.isCorrect && (
										<p className="text-cyberaware-success-green">
											<span className="font-semibold">Correct answer:</span>{" "}
											{detail.options[detail.correctAnswer]} ({detail.correctAnswer})
										</p>
									)}
								</div>
							</div>
						</div>
					</li>
				)}
			/>

			<Show.Root when={result.isPassed}>
				<Show.Content>
					<Button theme="orange" className="gap-2.5" asChild={true}>
						<NavLink href="/dashboard">Return to dashboard</NavLink>
					</Button>
				</Show.Content>

				<Show.Fallback>
					<Button theme="orange" onClick={onRetake} className="gap-2.5">
						Retake Quiz
						<IconBox icon="ri:brain-2-line" className="size-5" />
					</Button>
				</Show.Fallback>
			</Show.Root>
		</article>
	);
}

export { ResultView };
