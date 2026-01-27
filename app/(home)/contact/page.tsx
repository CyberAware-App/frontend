import { ForWithWrapper } from "@zayne-labs/ui-react/common/for";
import { IconBox } from "@/components/common/IconBox";
import { NavLink } from "@/components/common/NavLink";
import { NavBar } from "../-components";
import { Main } from "../../-components";

const contactMethods = [
	{
		description: "Get in touch with our support team",
		icon: "ri:mail-line",
		title: "Email Support",
		value: "zonwodi@gmail.com",
	},
	{
		description: "Join our community discussions",
		icon: "ri:discord-fill",
		title: "Discord Community",
		value: "discord.gg/ryan-zayne",
	},
	{
		description: "Follow us for updates and tips",
		icon: "ri:twitter-x-fill",
		title: "Twitter/X",
		value: "@zayne_el_kaiser",
	},
];

const faqs = [
	{
		answer: "The course is completely free for all users. No hidden costs or premium features.",
		question: "Is CyberAware really free?",
	},
	{
		answer: "You can take the course at your own pace. If you miss a day, you can catch up anytime.",
		question: "What if I miss a day?",
	},
	{
		answer: "Yes, you have up to 5 attempts to pass the final exam with 80% or higher.",
		question: "Can I retake the exam?",
	},
	{
		answer: "The course is designed for everyone - no technical background required.",
		question: "Do I need technical skills?",
	},
];

function ContactPage() {
	return (
		<Main className="gap-[78px]">
			<header className="flex flex-col gap-7 pt-[52px]">
				<NavLink
					href="/"
					className="flex items-center gap-1 pl-4 text-[12px] font-medium
						text-cyberaware-unizik-orange"
				>
					<IconBox icon="ri:arrow-left-line" className="size-4" />
					Back Home
				</NavLink>

				<NavBar />
			</header>

			<section className="flex flex-col gap-[74px]">
				<div className="flex flex-col gap-6 text-center">
					<h2 className="text-[36px] font-bold text-white">Get in Touch</h2>
					<p className="mx-auto max-w-[400px] text-white">
						Have questions? We're here to help you on your cybersecurity journey.
					</p>
				</div>

				<div className="flex flex-col gap-8">
					<div className="flex flex-col gap-6">
						<h3 className="text-center text-[24px] font-semibold text-white">Contact Us</h3>

						<ForWithWrapper
							className="flex flex-col gap-4 px-4"
							each={contactMethods}
							renderItem={(method) => (
								<li key={method.title} className="flex flex-col gap-3 rounded-lg bg-white p-6">
									<div className="flex items-center gap-3">
										<IconBox
											icon={method.icon}
											className="size-6 text-cyberaware-unizik-orange"
										/>
										<h4 className="text-[18px] font-semibold text-cyberaware-aeces-blue">
											{method.title}
										</h4>
									</div>
									<p className="text-[14px] text-cyberaware-body-color">{method.description}</p>
									<p className="font-medium text-cyberaware-aeces-blue">{method.value}</p>
								</li>
							)}
						/>
					</div>

					<div className="flex flex-col gap-6">
						<h3 className="text-center text-[24px] font-semibold text-white">
							Frequently Asked Questions
						</h3>

						<ForWithWrapper
							className="flex flex-col gap-4 px-4"
							each={faqs}
							renderItem={(faq) => (
								<li key={faq.question} className="flex flex-col gap-3 rounded-lg bg-white p-6">
									<h4 className="font-semibold text-cyberaware-aeces-blue">{faq.question}</h4>
									<p className="text-[14px] text-cyberaware-body-color">{faq.answer}</p>
								</li>
							)}
						/>
					</div>
				</div>
			</section>
		</Main>
	);
}

export default ContactPage;
