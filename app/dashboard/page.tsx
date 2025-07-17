import Image from "next/image";
import { Credits, Main } from "@/app/-components";
import { LockIcon } from "@/components/icons/LockIcon";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cnJoin, cnMerge } from "@/lib/utils/cn";
import { Afam } from "@/public/assets";

const cardDetails = [
	{
		id: 1,
		title: "Day 1: Cyber Security Foundation",
		body: "Estimated time: 10mins",
		buttonText: "Start Module",
		isSub: false,
	},
	{ id: 4, body: "Day 2", title: <LockIcon />, buttonText: "", isSub: true },
	{ id: 5, body: "Day 3", title: <LockIcon />, buttonText: "", isSub: true },
	{ id: 2, title: "Quiz", body: "Complete day 10 to activate", buttonText: "Take Quiz", isSub: false },
	{
		id: 3,
		title: "Certificate",
		body: "A Certificate of completion would be sent to your E-mail If you pass the minimum mark of 80% in the quiz",
		buttonText: "Download certificate",
		isSub: false,
	},
];

const page = () => {
	return (
		<Main className="gap-8 bg-white px-4 pt-[80px]">
			<section className="flex flex-col gap-5">
				<article className="flex items-center justify-between gap-5">
					<div className="flex flex-col gap-1">
						<p className="text-[28px] font-semibold text-cyberaware-aeces-blue">Hello, Aniekwe!</p>
						<p className="text-[14px]">You’re on Day 1 of 10</p>
					</div>

					<Image
						src={Afam}
						alt="user"
						className="size-[50px] rounded-full border-[2px] border-solid
							border-cyberaware-unizik-orange"
					/>
				</article>

				<article className="flex flex-col gap-3">
					<Progress
						value={10}
						classNames={{
							base: "h-3 rounded-[20px] bg-[hsl(0,0%,85%)]",
							indicator: "rounded-[20px] bg-cyberaware-unizik-orange",
						}}
					/>
					<p className="text-cyberaware-aeces-blue">10% complete</p>
				</article>
			</section>

			<section className="grid gap-x-3 gap-y-3.5">
				{cardDetails.map(({ id, title, body, buttonText, isSub }) => {
					return (
						<div
							key={id}
							className={cnJoin(
								"flex flex-col gap-5 bg-cyberaware-neutral-gray-lighter px-5 py-6",
								isSub ? "col-span-1" : "col-span-2"
							)}
						>
							<div className={cnJoin("flex flex-col", isSub ? "items-center gap-3.5" : "gap-2")}>
								<h4 className="text-[22px] font-semibold text-cyberaware-aeces-blue">{title}</h4>
								<p
									className={cnJoin(
										isSub ?
											"text-[24px] font-semibold text-cyberaware-aeces-blue"
										:	"text-[10px]"
									)}
								>
									{body}
								</p>
							</div>

							{!isSub && (
								<Button
									theme="orange"
									disabled={id !== 1}
									className={cnMerge("max-w-[150px] self-end")}
								>
									{buttonText}
								</Button>
							)}
						</div>
					);
				})}
			</section>

			<footer className="flex items-center gap-4 py-4 text-[10px]">
				<Credits />
			</footer>
		</Main>
	);
};

export default page;
