import { ForWithWrapper } from "@zayne-labs/ui-react/common/for";
import { Triangle } from "@/components/icons";
import { cnJoin } from "@/lib/utils/cn";

const howItWorks = [
	{
		title: "Sign Up",
		description: "Register with your email and get your welcome guide.",
	},
	{
		title: "Learn Daily",
		description: "Access one cybersecurity module each day — just 10–15 mins.",
	},
	{
		title: "Take the Quiz & Get Certified",
		description: "On Day 10, pass the quiz and download your certificate.",
	},
];

function HowItWorksLadder() {
	return (
		<ForWithWrapper
			className="relative isolate grid grid-cols-[auto_auto_auto] items-center justify-center gap-x-7
				gap-y-[75px]"
			each={howItWorks}
			render={(step, index) => {
				const digit = index + 1;
				const isDigitEven = digit % 2 === 0;

				return (
					<li key={step.title} className="contents">
						<hr className="absolute -z-1 h-[110%] w-full max-w-1 justify-self-center bg-white" />

						<p
							className={cnJoin(
								"w-fit justify-self-end text-[64px] font-semibold text-white",
								isDigitEven && "justify-self-start [grid-area:var(--grid-area)]"
							)}
							style={{ "--grid-area": `${digit}/3` } as React.CSSProperties}
						>
							{digit}
						</p>

						<span className="size-[45px] rounded-full bg-cyberaware-unizik-orange" />

						<div
							className={cnJoin(
								"relative isolate flex w-[150px] flex-col gap-2.5 bg-white p-4",
								isDigitEven && "rotate-y-180 [grid-area:var(--grid-area)]"
							)}
							style={{ "--grid-area": `${digit}/1` } as React.CSSProperties}
						>
							<Triangle
								className={cnJoin("absolute top-1/2 -left-5 -z-1 size-[46px] -translate-y-1/2")}
							/>
							<h4 className={cnJoin("text-cyberaware-aeces-blue", isDigitEven && "rotate-y-180")}>
								{step.title}
							</h4>
							<p
								className={cnJoin(
									"max-w-[120px] text-[12px] font-medium",
									isDigitEven && "rotate-y-180"
								)}
							>
								{step.description}
							</p>
						</div>
					</li>
				);
			}}
		/>
	);
}
export { HowItWorksLadder };
