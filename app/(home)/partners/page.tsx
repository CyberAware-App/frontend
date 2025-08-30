import { ForWithWrapper } from "@zayne-labs/ui-react/common/for";
import { IconBox } from "@/components/common/IconBox";
import { NavLink } from "@/components/common/NavLink";
import { Main } from "../../-components";
import { NavBar } from "../-components";

const partners = [
	{
		description:
			"Leading university providing academic support and institutional backing for cybersecurity education initiatives.",
		logo: "🏛️",
		name: "Nnamdi Azikiwe University",
		role: "Academic Partner",
	},
	{
		description:
			"Student association driving innovation and promoting cybersecurity awareness among engineering students.",
		logo: "👥",
		name: "AECES",
		role: "Student Organization",
	},
	{
		description:
			"Department providing technical expertise and curriculum development for the cybersecurity program.",
		logo: "⚡",
		name: "Department of Electronics & Computer Engineering",
		role: "Technical Partner",
	},
];

const collaborationAreas = [
	{
		description: "Joint development of cybersecurity curriculum and educational materials",
		icon: "ri:book-open-line",
		title: "Curriculum Development",
	},
	{
		description: "Research collaboration on cybersecurity education and awareness",
		icon: "ri:microscope-line",
		title: "Research & Innovation",
	},
	{
		description: "Community outreach programs to promote cybersecurity awareness",
		icon: "ri:team-line",
		title: "Community Outreach",
	},
	{
		description: "Industry partnerships for real-world cybersecurity training",
		icon: "ri:building-line",
		title: "Industry Collaboration",
	},
];

function PartnersPage() {
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
					<h2 className="text-[36px] font-bold text-white">Our Partners</h2>
					<p className="mx-auto max-w-[500px] text-[16px] text-white">
						Working together with leading institutions to make cybersecurity education accessible to
						everyone.
					</p>
				</div>

				<div className="flex flex-col gap-12">
					<div className="flex flex-col gap-8">
						<h3 className="text-center text-[24px] font-semibold text-white">
							Institutional Partners
						</h3>

						<ForWithWrapper
							className="flex flex-col gap-6 px-4"
							each={partners}
							renderItem={(partner) => (
								<li key={partner.name} className="flex flex-col gap-4 rounded-lg bg-white p-6">
									<div className="flex items-center gap-4">
										<div
											className="flex size-16 items-center justify-center rounded-full
												bg-cyberaware-light-orange text-[32px]"
										>
											{partner.logo}
										</div>
										<div className="flex flex-col gap-1">
											<h4 className="text-[20px] font-semibold text-cyberaware-aeces-blue">
												{partner.name}
											</h4>
											<p className="text-[14px] font-medium text-cyberaware-unizik-orange">
												{partner.role}
											</p>
										</div>
									</div>
									<p className="text-[14px] leading-relaxed text-cyberaware-body-color">
										{partner.description}
									</p>
								</li>
							)}
						/>
					</div>

					<div className="flex flex-col gap-8">
						<h3 className="text-center text-[24px] font-semibold text-white">
							Areas of Collaboration
						</h3>

						<ForWithWrapper
							className="flex flex-col gap-4 px-4"
							each={collaborationAreas}
							renderItem={(area) => (
								<li key={area.title} className="flex flex-col gap-3 rounded-lg bg-white p-6">
									<div className="flex items-center gap-3">
										<IconBox icon={area.icon} className="size-6 text-cyberaware-unizik-orange" />
										<h4 className="text-[18px] font-semibold text-cyberaware-aeces-blue">
											{area.title}
										</h4>
									</div>
									<p className="text-[14px] text-cyberaware-body-color">{area.description}</p>
								</li>
							)}
						/>
					</div>

					<div className="mx-4 flex flex-col gap-6 rounded-lg bg-cyberaware-light-orange p-6">
						<div className="flex items-center gap-3">
							<IconBox icon="ri:handshake-line" className="size-6 text-cyberaware-unizik-orange" />
							<h3 className="text-[20px] font-semibold text-cyberaware-aeces-blue">
								Interested in Partnership?
							</h3>
						</div>
						<p className="text-[14px] text-cyberaware-body-color">
							We're always looking for new partners to expand our cybersecurity education
							initiatives. Contact us at{" "}
							<span className="font-medium text-cyberaware-aeces-blue">
								partnerships@cyberaware.com
							</span>
						</p>
					</div>
				</div>
			</section>
		</Main>
	);
}

export default PartnersPage;
