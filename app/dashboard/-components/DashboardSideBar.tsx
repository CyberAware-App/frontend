"use client";

import Image from "next/image";
import { For } from "@/components/common/for";
import { IconBox } from "@/components/common/IconBox";
import { NavLink } from "@/components/common/NavLink";
import { Switch } from "@/components/common/switch";
import { HamburgerIcon } from "@/components/icons";
import { CollapsibleAnimated, Sidebar } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { logoSmall } from "@/public/assets";

const data = [
	{
		status: "complete",
		items: [
			{
				title: "History",
				url: "#",
			},
			{
				title: "Starred",
				url: "#",
			},
			{
				title: "Settings",
				url: "#",
			},
		],
		title: "Day 1",
		url: "#",
	},
	{
		status: "ongoing",
		items: [
			{
				title: "Genesis",
				url: "#",
			},
			{
				title: "Explorer",
				url: "#",
			},
			{
				title: "Quantum",
				url: "#",
			},
		],
		title: "Day 2",
		url: "#",
	},
	{
		status: "locked",
		items: [
			{
				title: "Introduction",
				url: "#",
			},
			{
				title: "Get Started",
				url: "#",
			},
			{
				title: "Tutorials",
				url: "#",
			},
			{
				title: "Changelog",
				url: "#",
			},
		],
		title: "Day 3",
		url: "#",
	},
] as const;

function DashboardSideBar() {
	return (
		<Sidebar.ContextProvider
			defaultOpen={false}
			sidebarWidth="245px"
			sidebarWidthIcon="70px"
			withMobileBreakpoint={false}
			className="w-[70px] shrink-0"
		>
			<Sidebar.Root
				collapsible="icon"
				variant="sidebar-unfixed"
				classNames={{ inner: "gap-8 bg-cyberaware-aeces-blue text-white" }}
			>
				<Sidebar.Header
					className="mt-[80px] items-center justify-between gap-8 overflow-hidden px-4 py-0
						in-data-[state=expanded]:flex-row in-data-[state=expanded]:gap-8"
				>
					<div className="flex items-center">
						<Image src={logoSmall} alt="Logo" className="max-w-10" />
						<h3 className="w-0 font-medium text-white in-data-[state=collapsed]:opacity-0">
							CyberAware
						</h3>
					</div>

					<Sidebar.Trigger className="size-6">
						<HamburgerIcon />
					</Sidebar.Trigger>
				</Sidebar.Header>

				<Sidebar.Content className="custom-scrollbar">
					<Sidebar.Group className="gap-6.5 p-4">
						<Sidebar.GroupLabel
							className="px-0 text-[22px] font-semibold text-white duration-500 ease-initial"
						>
							Your Progress
						</Sidebar.GroupLabel>

						<Sidebar.Menu className="gap-5 in-data-[state=collapsed]:hidden">
							<For
								each={data}
								render={(sidebarItem) => (
									<Sidebar.MenuItem key={sidebarItem.title}>
										<CollapsibleAnimated.Root
											key={sidebarItem.title}
											disabled={sidebarItem.status === "locked"}
											className="group/collapsible"
										>
											<Button
												theme="blue-light"
												isDisabled={sidebarItem.status === "locked"}
												className="h-[45px] justify-start gap-7 px-10 opacity-100"
												asChild={true}
											>
												<CollapsibleAnimated.Trigger>
													<Switch.Root>
														<Switch.Match when={sidebarItem.status === "complete"}>
															<IconBox icon="ri:check-line" />
														</Switch.Match>
														<Switch.Match when={sidebarItem.status === "ongoing"}>
															<IconBox
																icon="ri:arrow-right-s-line"
																className="transition-transform duration-200
																	group-data-[state=open]/collapsible:rotate-90"
															/>
														</Switch.Match>
														<Switch.Match when={sidebarItem.status === "locked"}>
															<IconBox icon="ri:lock-line" />
														</Switch.Match>
													</Switch.Root>

													<span>{sidebarItem.title}</span>
												</CollapsibleAnimated.Trigger>
											</Button>

											<Sidebar.MenuSub className="border-none">
												<CollapsibleAnimated.Content>
													<For
														each={sidebarItem.items}
														render={(subItem) => (
															<Sidebar.MenuSubItem key={subItem.title}>
																<NavLink href={subItem.url}>
																	<span>{subItem.title}</span>
																</NavLink>
															</Sidebar.MenuSubItem>
														)}
													/>
												</CollapsibleAnimated.Content>
											</Sidebar.MenuSub>
										</CollapsibleAnimated.Root>
									</Sidebar.MenuItem>
								)}
							/>

							<Button className="mt-2.5 w-fit text-cyberaware-unizik-orange" unstyled={true}>
								Logout
							</Button>
						</Sidebar.Menu>
					</Sidebar.Group>
				</Sidebar.Content>

				<Sidebar.Rail
					className="h-[50px] w-6 bg-cyberaware-aeces-blue duration-500 ease-initial
						group-data-[state=collapsed]:-translate-x-6 group-data-[state=expanded]:translate-x-0"
				/>
			</Sidebar.Root>
		</Sidebar.ContextProvider>
	);
}

export { DashboardSideBar };
