import { ForWithWrapper } from "@zayne-labs/ui-react/common/for";
import { IconBox } from "@/components/common/IconBox";
import { NavLink } from "@/components/common/NavLink";
import { NavBar } from "../-components";
import { Main } from "../../-components";

const privacySections = [
	{
		content:
			"We collect your email address, name, and course progress to provide you with the best learning experience. Your data is used solely for educational purposes and to track your certification progress.",
		title: "Information We Collect",
	},
	{
		content:
			"Your personal information is stored securely and is never shared with third parties. We use industry-standard encryption to protect your data during transmission and storage.",
		title: "How We Protect Your Data",
	},
	{
		content:
			"We use cookies to improve your learning experience and track your progress through the course. These cookies are essential for the platform to function properly.",
		title: "Use of Cookies",
	},
	{
		content:
			"You have the right to access, update, or delete your personal information at any time. Contact us if you need assistance with your data or have privacy concerns.",
		title: "Your Rights",
	},
	{
		content:
			"This privacy policy may be updated from time to time. We will notify you of any significant changes via email or through the platform.",
		title: "Policy Updates",
	},
];

function PrivacyPolicyPage() {
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
					<h2 className="text-[36px] font-bold text-white">Privacy Policy</h2>
					<p className="mx-auto max-w-[500px] text-white">
						Your privacy is important to us. This policy explains how we collect, use, and protect
						your information.
					</p>
				</div>

				<div className="flex flex-col gap-8">
					<div className="text-center">
						<p className="text-[14px] text-white">Last updated: January 2025</p>
					</div>

					<ForWithWrapper
						className="flex flex-col gap-6 px-4"
						each={privacySections}
						renderItem={(section, index) => (
							<li key={section.title} className="flex flex-col gap-4 rounded-lg bg-white p-6">
								<div className="flex items-center gap-3">
									<div
										className="flex size-8 items-center justify-center rounded-full
											bg-cyberaware-light-orange"
									>
										<span className="text-[14px] font-semibold text-cyberaware-unizik-orange">
											{index + 1}
										</span>
									</div>
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

					<div className="mx-4 flex flex-col gap-4 rounded-lg bg-white p-6">
						<div className="flex items-center gap-3">
							<IconBox
								icon="ri:shield-check-line"
								className="size-6 text-cyberaware-unizik-orange"
							/>
							<h3 className="text-[20px] font-semibold text-cyberaware-aeces-blue">
								Contact Us About Privacy
							</h3>
						</div>
						<p className="text-[14px] text-cyberaware-body-color">
							If you have any questions about this privacy policy or how we handle your data, please
							contact us at{" "}
							<span className="font-medium text-cyberaware-aeces-blue">privacy@cyberaware.com</span>
						</p>
					</div>
				</div>
			</section>
		</Main>
	);
}

export default PrivacyPolicyPage;
