"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { IconBox } from "@/components/common/IconBox";
import { NavLink } from "@/components/common/NavLink";
import { Progress } from "@/components/ui/progress-animated";
import { dashboardQuery, type SelectedModule } from "@/lib/react-query/queryOptions";
import { Afam, logoSmall } from "@/public/assets";
import { usePathname } from "next/navigation";

type ModuleHeadingProps = {
	totalModules: number | undefined;
	selectedModule: SelectedModule;
};

function ModuleHeading(props: ModuleHeadingProps) {
	const { selectedModule, totalModules } = props;

	const dashboardQueryResult = useQuery(dashboardQuery());

	const pathName = usePathname();
	const quizPath = "/quiz";

	const isQuizPage = pathName.endsWith(quizPath);
	const modulePath = pathName.replace(quizPath, "");

	return (
		<header className="px-4 pt-[50px] pb-8">
			<NavLink
				href={isQuizPage ? modulePath : "/dashboard"}
				className="flex items-center gap-1 text-[12px] text-cyberaware-unizik-orange"
			>
				<IconBox icon="ri:arrow-left-line" className="size-4" />
				Back to {isQuizPage ? "module" : "dashboard"}
			</NavLink>

			<article className="mt-4 flex items-center justify-between gap-5">
				<div className="flex items-center">
					<Image src={logoSmall} alt="Logo" className="max-w-10" />
					<h3 className="w-0 text-[22px] font-medium text-white in-data-[state=collapsed]:opacity-0">
						CyberAware
					</h3>
				</div>

				<Image
					src={Afam}
					alt="user"
					className="size-[50px] rounded-full border-[2px] border-solid
						border-cyberaware-unizik-orange"
				/>
			</article>

			<article className="mt-5.5 flex items-center gap-4">
				<p className="shrink-0 text-[18px] font-semibold text-cyberaware-neutral-gray-light">
					{selectedModule.title} of {totalModules}
				</p>

				<Progress
					value={dashboardQueryResult.data?.percentage_completed}
					classNames={{
						base: "h-3 rounded-[20px] bg-[hsl(0,0%,85%)]",
						indicator: "rounded-[20px] bg-cyberaware-unizik-orange",
					}}
				/>
			</article>
		</header>
	);
}
export { ModuleHeading };
