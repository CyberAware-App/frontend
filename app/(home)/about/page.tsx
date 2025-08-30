import { ForWithWrapper } from "@zayne-labs/ui-react/common/for";
import { IconBox } from "@/components/common/IconBox";
import { NavLink } from "@/components/common/NavLink";
import { Main } from "../../-components";
import { NavBar } from "../-components";

const aboutSections = [
	{
		content:
			"CyberAware is a comprehensive cybersecurity education platform designed to make digital safety accessible to everyone. Our mission is to empower individuals with the knowledge and skills needed to protect themselves in an increasingly digital world.",
		icon: "ri:shield-user-line",
		title: "Our Mission",
	},
	{
		content:
			"We believe that cybersecurity education should be accessible, practical, and engaging. Our platform combines expert knowledge with interactive learning experiences to create a unique educational journey.",
		icon: "ri:lightbulb-line",
		title: "Our Approach",
	},
	{
		content:
			"Our curriculum is developed by cybersecurity experts and educators, ensuring that you receive accurate, up-to-date information that's relevant to real-world threats and challenges.",
		icon: "ri:user-star-line",
		title: "Expert-Led Content",
	},
];

const keyFeatures = [
	{
		description: "Learn at your own pace with our flexible 10-day program",
		icon: "ri:time-line",
		title: "Self-Paced Learning",
	},
	{
		description: "Interactive modules with real-world examples and scenarios",
		icon: "ri:play-circle-line",
		title: "Interactive Content",
	},
	{
		description: "Earn a recognized certificate upon successful completion",
		icon: "ri:medal-line",
		title: "Certification",
	},
	{
		description: "No technical background required - designed for everyone",
		icon: "ri:user-line",
		title: "Beginner-Friendly",
	},
];

const stats = [
	{
		label: "Modules",
		value: "10",
		icon: "ri:book-open-line",
	},
	{
		label: "Days to Complete",
		value: "10",
		icon: "ri:time-line",
	},
	{
		label: "Passing Score",
		value: "80%",
		icon: "ri:check-double-line",
	},
	{
		label: "Certificate",
		value: "Free",
		icon: "ri:medal-line",
	},
];

function AboutPage() {
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
					<h2 className="text-[36px] font-bold text-white">About CyberAware</h2>
					<p className="mx-auto max-w-[500px] text-[16px] text-white">
						Empowering everyone with essential cybersecurity knowledge through accessible,
						interactive education.
					</p>
				</div>

				<div className="flex flex-col gap-12">
					<ForWithWrapper
						className="flex flex-col gap-6 px-4"
						each={aboutSections}
						renderItem={(section) => (
							<li key={section.title} className="flex flex-col gap-4 rounded-lg bg-white p-6">
								<div className="flex items-center gap-3">
									<IconBox icon={section.icon} className="size-6 text-cyberaware-unizik-orange" />
									<h3 className="text-[20px] font-semibold text-cyberaware-aeces-blue">
										{section.title}
									</h3>
								</div>
								<p className="text-[14px] leading-relaxed text-cyberaware-body-color">
									{section.content}
								</p>
							</li>
						)}
					/>

					<div className="flex flex-col gap-8">
						<h3 className="text-center text-[24px] font-semibold text-white">
							Why Choose CyberAware?
						</h3>

						<ForWithWrapper
							className="flex flex-col gap-4 px-4"
							each={keyFeatures}
							renderItem={(feature) => (
								<li key={feature.title} className="flex flex-col gap-3 rounded-lg bg-white p-6">
									<div className="flex items-center gap-3">
										<IconBox
											icon={feature.icon}
											className="size-6 text-cyberaware-unizik-orange"
										/>
										<h4 className="text-[18px] font-semibold text-cyberaware-aeces-blue">
											{feature.title}
										</h4>
									</div>
									<p className="text-[14px] text-cyberaware-body-color">{feature.description}</p>
								</li>
							)}
						/>
					</div>

					<div className="flex flex-col gap-6">
						<h3 className="text-center text-[24px] font-semibold text-white">Program Overview</h3>

						<ForWithWrapper
							className="grid grid-cols-2 gap-3 px-4"
							each={stats}
							renderItem={(stat) => (
								<li key={stat.label} className="flex items-start gap-3 rounded-lg bg-white p-4">
									<IconBox
										icon={stat.icon}
										className="mt-1 size-6 text-cyberaware-unizik-orange"
									/>
									<div>
										<p className="text-[20px] font-bold text-cyberaware-aeces-blue">
											{stat.value}
										</p>
										<p className="text-[12px] text-cyberaware-body-color">{stat.label}</p>
									</div>
								</li>
							)}
						/>
					</div>

					<div className="mx-4 flex flex-col gap-6 rounded-lg bg-cyberaware-light-orange p-6">
						<div className="flex items-center gap-3">
							<IconBox icon="ri:rocket-line" className="size-6 text-cyberaware-unizik-orange" />
							<h3 className="text-[20px] font-semibold text-cyberaware-aeces-blue">
								Ready to Get Started?
							</h3>
						</div>
						<p className="text-[14px] text-cyberaware-body-color">
							Join thousands of learners who are already protecting themselves online. Start your
							cybersecurity journey today!
						</p>
						<NavLink
							href="/auth/signin"
							className="mt-2 self-start rounded-lg bg-cyberaware-unizik-orange px-6 py-3
								text-[14px] font-semibold text-white"
						>
							Start Learning Now
						</NavLink>
					</div>
				</div>
			</section>
		</Main>
	);
}

export default AboutPage;
