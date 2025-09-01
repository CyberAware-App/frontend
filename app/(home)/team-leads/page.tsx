import { ForWithWrapper } from "@zayne-labs/ui-react/common/for";
import { IconBox } from "@/components/common/IconBox";
import { NavLink } from "@/components/common/NavLink";
import { Main } from "../../-components";
import { NavBar } from "../-components";

const teamLeads = [
	{
		name: "Ikedigwe Ebubechukwu .P.",
		role: "Front-end Team",
	},
	{
		name: "Udemgba Ferdinand .C.",
		role: "Back-end Team",
	},
	{
		name: "Nwabanne Treasure .U.",
		role: "Content Team",
	},
	{
		name: "Nwankwo Jeffery .K.",
		role: "UI/UX Design Team",
	},
	{
		name: "Bello Yusuf",
		role: "Cybersecurity Expert",
	},
	{
		name: "Onwodi Zion",
		role: "Project Manager",
	},
];

function TeamPage() {
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
				<h2 className="px-8 text-center text-[36px] font-bold text-white">Meet the team leads</h2>

				<ForWithWrapper
					className="flex flex-col gap-4.5 px-4"
					each={teamLeads}
					renderItem={(teamLead, index) => (
						<li className="flex gap-4 bg-white px-3 py-4 font-medium" key={teamLead.name}>
							<h4 className="shrink-0 text-cyberaware-aeces-blue">
								{index + 1}. {teamLead.role}:
							</h4>

							<p className="truncate">{teamLead.name}</p>
						</li>
					)}
				/>
			</section>
		</Main>
	);
}

export default TeamPage;
