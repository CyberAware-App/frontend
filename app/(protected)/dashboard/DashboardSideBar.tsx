"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { For } from "@/components/common/for";
import { IconBox } from "@/components/common/IconBox";
import { NavLink } from "@/components/common/NavLink";
import { Switch } from "@/components/common/switch";
import { HamburgerIcon } from "@/components/icons";
import { CollapsibleAnimated, Sidebar } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { dashboardQuery } from "@/lib/react-query/queryOptions";
import { logoSmall } from "@/public/assets";
import { logout } from "./utils";

function DashboardSideBar() {
	const dashboardQueryResult = useQuery(dashboardQuery());

	const queryClient = useQueryClient();

	return (
		<Sidebar.ContextProvider
			defaultOpen={false}
			sidebarWidth="250px"
			sidebarWidthIcon="60px"
			withMobileBreakpoint={false}
			className="max-w-(--sidebar-width-icon) shrink-0"
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
					<NavLink href="/" className="flex items-center">
						<Image src={logoSmall} alt="Logo" className="max-w-10" />
						<h3 className="w-0 font-medium text-white in-data-[state=collapsed]:opacity-0">
							CyberAware
						</h3>
					</NavLink>

					<Sidebar.Trigger className="size-6">
						<HamburgerIcon />
					</Sidebar.Trigger>
				</Sidebar.Header>

				<Sidebar.Content className="custom-scrollbar">
					<Sidebar.Group className="gap-6.5 px-4 pt-4 pb-8">
						<Sidebar.GroupLabel className="px-0 text-[22px] font-semibold text-white duration-500">
							Your Progress
						</Sidebar.GroupLabel>

						<Sidebar.Menu className="gap-5 in-data-[state=collapsed]:hidden">
							<For
								each={dashboardQueryResult.data?.modules ?? []}
								renderItem={(sidebarItem) => (
									<Sidebar.MenuItem key={sidebarItem.id}>
										<CollapsibleAnimated.Root
											key={sidebarItem.id}
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
													<span className="block size-4">
														<Switch.Root>
															<Switch.Match when={sidebarItem.status === "complete"}>
																<IconBox icon="ri:check-line" className="size-full" />
															</Switch.Match>
															<Switch.Match when={sidebarItem.status === "ongoing"}>
																<IconBox
																	icon="ri:arrow-right-s-line"
																	className="size-full transition-transform duration-200
																		group-data-[state=open]/collapsible:rotate-90"
																/>
															</Switch.Match>
															<Switch.Match when={sidebarItem.status === "locked"}>
																<IconBox icon="ri:lock-line" className="size-full" />
															</Switch.Match>
														</Switch.Root>
													</span>

													<span>{sidebarItem.title}</span>
												</CollapsibleAnimated.Trigger>
											</Button>

											<Sidebar.MenuSub className="mx-0 border-none px-0">
												<CollapsibleAnimated.Content>
													<Sidebar.MenuSubItem className="group/menu-item">
														<NavLink
															href={`/dashboard/module/${sidebarItem.id}`}
															className="flex items-center gap-3 px-5 py-2.5 text-[14px]"
														>
															<span className="block size-4 shrink-0">
																<IconBox
																	icon={
																		sidebarItem.module_type === "video" ?
																			"ri:play-circle-line"
																		:	"ri:file-text-line"
																	}
																	className="size-full"
																/>
															</span>

															<span className="line-clamp-2">{sidebarItem.name}</span>
														</NavLink>
													</Sidebar.MenuSubItem>
												</CollapsibleAnimated.Content>
											</Sidebar.MenuSub>
										</CollapsibleAnimated.Root>
									</Sidebar.MenuItem>
								)}
							/>

							<Button
								className="mt-2.5 w-fit text-cyberaware-unizik-orange"
								unstyled={true}
								onClick={() => logout(queryClient)}
							>
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
