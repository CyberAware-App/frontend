import Image from "next/image";
import { ForWithWrapper } from "@/components/common/for";
import { Button } from "@/components/ui/button";
import { tw } from "@/lib/utils/cn";
import {
	aecesLogo,
	eyeShield,
	modelOne,
	modelTwo,
	reasonFour,
	reasonOne,
	reasonThree,
	reasonTwo,
	unizikLogo,
} from "@/public/assets/landing";
import { Main } from "../-components";

const reasons = [
	{
		title: "Real-World Cyber Protection",
		description: "Learn to spot phishing, password hacks, and social engineering.",
		icon: { src: reasonOne, size: tw`max-w-[92px]` },
	},
	{
		title: "10 Easy-to-Digest Modules",
		description: "Progress through one lesson per day — simple, fast, and practical.",
		icon: { src: reasonTwo, size: tw`max-w-[70px]` },
	},
	{
		title: "No Tech Background Needed",
		description: "We keep it beginner-friendly with relatable examples.",
		icon: { src: reasonThree, size: tw`max-w-[102px]` },
	},
	{
		title: "Get Certified",
		description: "Score 80% on a quiz and earn a shareable digital certificate.",
		icon: { src: reasonFour, size: tw`max-w-[158px]` },
	},
];

const faqs = [
	{
		question: "1. Do I need technical skills to take this course?",
		answer: "Ans: No. The content is made for everyone.",
	},
	{
		question: "2. Is it really free?",
		answer: "Ans: Yes! 100% free for all users.",
	},
	{
		question: "3. What happens if I miss a day?",
		answer: "You can catch up anytime. You’re in control of your pace.",
	},
	{
		question: "4. Can I retake the quiz?",
		answer: "Yes, you have up to 5 attempts to score 80% or above.",
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
					Learn how to protect your digital world in just 10 days. Designed for lecturers, staff, and
					students.
				</p>

				<div className="flex items-center justify-center gap-3.5">
					<Button theme="blue-ghost" className="max-w-[118px]">
						Learn More
					</Button>
					<Button className="max-w-[175px]">Get Started</Button>
				</div>

				<article className="flex items-start gap-2.5 text-[10px]">
					<h4 className="mt-1 shrink-0">Powered By:</h4>

					<div className="flex flex-col gap-2.5">
						<figure className="flex items-center gap-2.5">
							<Image src={aecesLogo} alt="AECES Logo" className="size-6" />
							<figcaption>Association of Electronic and Computer Engineering Students,</figcaption>
						</figure>
						<figure className="flex items-center gap-2.5">
							<Image src={unizikLogo} alt="Unizik Logo" className="size-7" />
							<figcaption>Nnamdi Azikiwe University, Awka</figcaption>
						</figure>
					</div>
				</article>
			</section>

			<section className="mt-12 flex px-4">
				<div className="flex">
					<span className="block w-[15px] shrink-0 bg-cyberaware-unizik-orange" />
					<div>
						<Image src={modelOne} alt="Model One" />
					</div>
				</div>
			</section>

			<section className="mt-13 flex flex-col gap-10 px-[64px]">
				<h2 className="mx-6 max-w-[238px] text-[28px] font-semibold text-white">
					Why you need to be Aware
				</h2>

				<ForWithWrapper
					className="flex flex-col gap-5"
					each={reasons}
					render={(item) => (
						<li key={item.title} className="flex flex-col gap-3 bg-white p-4">
							<Image src={item.icon.src} alt={item.title} className={item.icon.size} />
							<h4 className="text-[22px] font-semibold text-cyberaware-aeces-blue">{item.title}</h4>
							<p className="text-[14px]">{item.description}</p>
						</li>
					)}
				/>
			</section>

			<section className="mt-[84px] px-4">
				<h2 className="text-center text-[28px] font-semibold text-white">How CyberAware Works</h2>
			</section>

			<section className="mt-12 flex flex-col gap-7 bg-cyberaware-light-orange p-4">
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
				<Button theme="white" className="mt-10 h-[72px] max-w-[314px]">
					Get Started
				</Button>
			</section>
		</Main>
	);
}

export default HomePage;
