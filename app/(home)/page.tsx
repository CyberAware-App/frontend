import Image from "next/image";
import { ForWithWrapper } from "@/components/common/for";
import { NavLink } from "@/components/common/NavLink";
import { Button } from "@/components/ui/button";
import { tw } from "@/lib/utils/cn";
import {
	eyeShield,
	modelOne,
	modelTwo,
	reasonFour,
	reasonOne,
	reasonThree,
	reasonTwo,
} from "@/public/assets/landing";
import { Credits, Main } from "../-components";
import { HowItWorksLadder } from "./-components";

const reasons = [
	{
		description: "Learn to spot phishing, password hacks, and social engineering.",
		icon: { size: tw`max-w-[92px]`, src: reasonOne },
		title: "Real-World Cyber Protection",
	},
	{
		description: "Progress through one lesson per day — simple, fast, and practical.",
		icon: { size: tw`max-w-[70px]`, src: reasonTwo },
		title: "10 Easy-to-Digest Modules",
	},
	{
		description: "We keep it beginner-friendly with relatable examples.",
		icon: { size: tw`max-w-[102px]`, src: reasonThree },
		title: "No Tech Background Needed",
	},
	{
		description: "Score 80% on a quiz and earn a shareable digital certificate.",
		icon: { size: tw`max-w-[158px]`, src: reasonFour },
		title: "Get Certified",
	},
];

const faqs = [
	{
		answer: "Ans: No. The content is made for everyone.",
		question: "1. Do I need technical skills to take this course?",
	},
	{
		answer: "Ans: Yes! 100% free for all users.",
		question: "2. Is it really free?",
	},
	{
		answer: "You can catch up anytime. You’re in control of your pace.",
		question: "3. What happens if I miss a day?",
	},
	{
		answer: "Yes, you have up to 5 attempts to score 80% or above.",
		question: "4. Can I retake the quiz?",
	},
];

function HomePage() {
	return (
		<Main>
			<section className="mx-4 mt-4 flex flex-col gap-8 bg-white px-[45px] pt-[170px] pb-4">
				<h1 className="text-center text-[36px] font-bold text-cyberaware-aeces-blue">
					Be CyberAware.
					<span className="inline-flex items-center">
						Stay <Image src={eyeShield} alt="Eye Shield" className="mt-1 ml-2 size-6" /> Secure
					</span>
					.
				</h1>

				<p className="text-center text-[16px] text-cyberaware-body-color">
					Learn how to protect your digital world within just 10 modules. Designed for lecturers,
					staff, and students.
				</p>

				<div className="flex items-center justify-center gap-3.5">
					<Button theme="blue-ghost" className="max-w-[118px]">
						Learn More
					</Button>

					<Button className="max-w-[175px]" asChild={true}>
						<NavLink href="/auth/signin">Get Started</NavLink>
					</Button>
				</div>

				<Credits />
			</section>

			<section className="mt-12 flex px-4">
				<span className="block w-[15px] shrink-0 bg-cyberaware-unizik-orange" />
				<div>
					<Image src={modelOne} alt="Model One" />
				</div>
			</section>

			<section className="mt-13 flex flex-col gap-10 px-[72px]">
				<h2 className="mx-6 max-w-[238px] text-[28px] font-semibold text-white">
					Why you need to be Aware
				</h2>

				<ForWithWrapper
					className="flex flex-col gap-5"
					each={reasons}
					render={(item) => (
						<li key={item.title} className="flex flex-col gap-3 bg-white px-6 py-4">
							<Image src={item.icon.src} alt={item.title} className={item.icon.size} />
							<h4 className="text-[22px] font-semibold text-cyberaware-aeces-blue">{item.title}</h4>
							<p className="text-[14px]">{item.description}</p>
						</li>
					)}
				/>
			</section>

			<section className="mt-[84px] flex flex-col gap-[64px] px-4">
				<h2 className="text-center text-[28px] font-semibold text-white">How CyberAware Works</h2>

				<HowItWorksLadder />
			</section>

			<section className="mt-20 flex flex-col gap-7 bg-cyberaware-light-orange p-4">
				<div className="flex">
					<span className="block w-[15px] shrink-0 bg-cyberaware-unizik-orange" />
					<div>
						<Image src={modelTwo} alt="Model Two" />
					</div>
				</div>

				<article className="flex flex-col items-center gap-9">
					<h2 className="max-w-[320px] text-[36px] font-bold text-cyberaware-aeces-blue">
						Frequently Asked Questions
					</h2>

					<ForWithWrapper
						className="flex flex-col gap-5"
						each={faqs}
						render={(item) => (
							<li key={item.question} className="flex flex-col gap-3 bg-white p-4 font-medium">
								<h4 className="text-cyberaware-aeces-blue">{item.question}</h4>
								<p className="text-[12px]">{item.answer}</p>
							</li>
						)}
					/>
				</article>
			</section>

			<section className="flex flex-col items-center bg-cyberaware-unizik-orange p-10 text-white">
				<h2 className="text-[36px] font-bold">Ready to Stay Safe Online?</h2>
				<p className="mt-3.5 text-[14px]">
					Join thousands of users becoming cyber smart in just 10 days.
				</p>
				<Button theme="white" className="mt-10 h-[72px] max-w-[314px]" asChild={true}>
					<NavLink href="/auth/signin">Get Started</NavLink>
				</Button>
			</section>

			<section className="mt-7 px-4">
				<h2 className="font-semibold text-white">Powered by AECES 2025 Set – Computer Option</h2>

				<p className="mt-2 text-[14px] text-white">
					Project designed and developed by the 2025 final-year students of the Department of
					Electronics and Computer Engineering, NAU.
				</p>

				<Button className="mt-5 h-[57px] max-w-[240px]" asChild={true}>
					<NavLink href="/team-leads">Meet the team Leads</NavLink>
				</Button>
			</section>
		</Main>
	);
}

export default HomePage;
