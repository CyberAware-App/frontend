import { IconBox } from "@/components/common/IconBox";
import { NavLink } from "@/components/common/NavLink";
import { Button } from "@/components/ui/button";

type ExamGuidelinesProps = {
	onProceed: () => void;
};

function ExamGuidelines(props: ExamGuidelinesProps) {
	const { onProceed } = props;

	return (
		<article className="flex flex-col gap-10">
			<div className="flex flex-col items-center gap-6 text-center">
				<div
					className="flex size-20 items-center justify-center rounded-full bg-cyberaware-light-orange"
				>
					<IconBox icon="ri:file-text-line" className="size-10 text-cyberaware-unizik-orange" />
				</div>

				<h3 className="text-[28px] font-semibold text-cyberaware-aeces-blue">Exam Guidelines</h3>

				<p className="max-w-[400px] text-[16px] font-medium text-cyberaware-body-color">
					You are about to take the final cybersecurity exam. Please read the following information
					carefully:
				</p>
			</div>

			<div className="flex flex-col gap-4">
				<div className="flex flex-col gap-3">
					<div className="flex items-start gap-3 rounded-lg bg-cyberaware-neutral-gray-lighter p-4">
						<IconBox
							icon="ri:time-line"
							className="mt-0.5 size-5 shrink-0 text-cyberaware-unizik-orange"
						/>
						<div className="flex flex-col gap-1">
							<p className="text-[14px] font-semibold text-cyberaware-aeces-blue">
								Time Limit: 35 minutes
							</p>
							<p className="text-[12px] text-cyberaware-body-color">
								The exam will automatically submit when time expires
							</p>
						</div>
					</div>

					<div className="flex items-start gap-3 rounded-lg bg-cyberaware-neutral-gray-lighter p-4">
						<IconBox
							icon="ri:question-line"
							className="mt-0.5 size-5 shrink-0 text-cyberaware-unizik-orange"
						/>
						<div className="flex flex-col gap-1">
							<p className="text-[14px] font-semibold text-cyberaware-aeces-blue">50 Questions</p>
							<p className="text-[12px] text-cyberaware-body-color">
								Multiple choice questions covering all modules
							</p>
						</div>
					</div>

					<div className="flex items-start gap-3 rounded-lg bg-cyberaware-neutral-gray-lighter p-4">
						<IconBox
							icon="ri:shield-check-line"
							className="mt-0.5 size-5 shrink-0 text-cyberaware-unizik-orange"
						/>
						<div className="flex flex-col gap-1">
							<p className="text-[14px] font-semibold text-cyberaware-aeces-blue">
								Passing Score: 80%
							</p>
							<p className="text-[12px] text-cyberaware-body-color">
								You need 40+ correct answers to pass
							</p>
						</div>
					</div>

					<div className="flex items-start gap-3 rounded-lg bg-cyberaware-neutral-gray-lighter p-4">
						<IconBox
							icon="ri:refresh-line"
							className="mt-0.5 size-5 shrink-0 text-cyberaware-unizik-orange"
						/>
						<div className="flex flex-col gap-1">
							<p className="text-[14px] font-semibold text-cyberaware-aeces-blue">
								Multiple Attempts
							</p>
							<p className="text-[12px] text-cyberaware-body-color">
								You have up to 5 attempts to achieve a passing score
							</p>
						</div>
					</div>
				</div>

				<div className="rounded-lg bg-cyberaware-light-orange p-4">
					<p className="text-center text-[14px] font-medium text-cyberaware-aeces-blue">
						⚠️ Make sure you have a stable internet connection and won't be interrupted during the
						exam.
					</p>
				</div>
			</div>

			<div className="flex items-center justify-center gap-4">
				<Button theme="blue-ghost" asChild={true}>
					<NavLink href="/dashboard">Cancel</NavLink>
				</Button>

				<Button theme="orange" className="gap-2.5" onClick={onProceed}>
					Proceed
					<IconBox icon="ri:brain-2-line" className="size-5" />
				</Button>
			</div>
		</article>
	);
}

export { ExamGuidelines };
