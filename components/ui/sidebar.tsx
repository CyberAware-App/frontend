"use client";

import { useConstant } from "@zayne-labs/toolkit-react";
import type { InferProps } from "@zayne-labs/toolkit-react/utils";
import { Slot } from "@zayne-labs/ui-react/common/slot";
import { createContext, use, useCallback, useEffect, useMemo, useState } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { FormInput } from "@/components/ui/form";
import { Separator as SeparatorPrimitive } from "@/components/ui/separator";
import * as Sheet from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import * as Tooltip from "@/components/ui/tooltip";
import { useIsMobile } from "@/components/ui/useMobile";
import { cnMerge } from "@/lib/utils/cn";
import { IconBox } from "../common/IconBox";

const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "256px";
const SIDEBAR_WIDTH_MOBILE = "288px";
const SIDEBAR_WIDTH_ICON = "48px";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

type SidebarContextType = {
	isMobile: boolean;
	open: boolean;
	sidebarWidth?: string;
	sidebarWidthIcon?: string;
	sidebarWidthMobile?: string;
	openMobile: boolean;
	setOpen: (open: boolean) => void;
	setOpenMobile: (open: boolean) => void;
	state: "collapsed" | "expanded";
	toggleSidebar: () => void;
};

const SidebarContext = createContext<SidebarContextType | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export function useSidebarContext() {
	const context = use(SidebarContext);

	if (!context) {
		throw new Error("useSidebar must be used within a SidebarProvider.");
	}

	return context;
}

export function SidebarContextProvider(
	props: InferProps<"div">
		& Pick<SidebarContextType, "sidebarWidth" | "sidebarWidthIcon" | "sidebarWidthMobile"> & {
			withMobileBreakpoint?: boolean;
			defaultOpen?: boolean;
			onOpenChange?: (open: boolean) => void;
			open?: boolean;
		}
) {
	const {
		children,
		className,
		sidebarWidth = SIDEBAR_WIDTH,
		sidebarWidthIcon = SIDEBAR_WIDTH_ICON,
		sidebarWidthMobile = SIDEBAR_WIDTH_MOBILE,
		withMobileBreakpoint = true,
		defaultOpen = true,
		onOpenChange: setOpenProp,
		open: openProp,
		style,
		...restOfProps
	} = props;

	const isMobile = useIsMobile({ enable: withMobileBreakpoint });
	const [openMobile, setOpenMobile] = useState(false);

	// This is the internal state of the sidebar.
	// We use openProp and setOpenProp for control from outside the component.
	const [internalOpen, setInternalOpen] = useState(defaultOpen);

	const open = openProp ?? internalOpen;

	const setOpen = useCallback(
		(value: boolean | ((value: boolean) => boolean)) => {
			const openState = typeof value === "function" ? value(open) : value;

			if (setOpenProp) {
				setOpenProp(openState);
			} else {
				setInternalOpen(openState);
			}

			// This sets the cookie to keep the sidebar state.
			// eslint-disable-next-line unicorn/no-document-cookie
			document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
		},
		[setOpenProp, open]
	);

	// Helper to toggle the sidebar.
	const toggleSidebar = useCallback(() => {
		return isMobile ? setOpenMobile((prevOpen) => !prevOpen) : setOpen((prevOpen) => !prevOpen);
	}, [isMobile, setOpen, setOpenMobile]);

	// Adds a keyboard shortcut to toggle the sidebar.
	useEffect(() => {
		const controller = new AbortController();

		window.addEventListener(
			"keydown",
			(event) => {
				if ((event.metaKey || event.ctrlKey) && event.key === SIDEBAR_KEYBOARD_SHORTCUT) {
					event.preventDefault();
					toggleSidebar();
				}
			},
			{ signal: controller.signal }
		);

		return () => controller.abort();
	}, [toggleSidebar]);

	// We add a state so that we can do data-state="expanded" or "collapsed".
	// This makes it easier to style the sidebar with Tailwind classes.
	const sidebarState = open ? "expanded" : "collapsed";

	const contextValue = useMemo<SidebarContextType>(
		() => ({
			isMobile,
			open,
			openMobile,
			setOpen,
			setOpenMobile,
			sidebarWidth,
			sidebarWidthIcon,
			sidebarWidthMobile,
			state: sidebarState,
			toggleSidebar,
		}),
		[
			isMobile,
			open,
			openMobile,
			setOpen,
			sidebarWidth,
			sidebarWidthIcon,
			sidebarWidthMobile,
			sidebarState,
			toggleSidebar,
		]
	);

	return (
		<SidebarContext value={contextValue}>
			<Tooltip.ContextProvider delayDuration={0}>
				<div
					data-slot="sidebar-wrapper"
					className={cnMerge(
						"group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-shadcn-sidebar",
						className
					)}
					style={
						{
							"--sidebar-width": sidebarWidth,
							"--sidebar-width-icon": sidebarWidthIcon,
							...style,
						} as React.CSSProperties
					}
					{...restOfProps}
				>
					{children}
				</div>
			</Tooltip.ContextProvider>
		</SidebarContext>
	);
}

function SidebarRoot(
	props: InferProps<"div"> & {
		collapsible?: "icon" | "none" | "offcanvas";
		side?: "left" | "right";
		variant?: "floating" | "inset" | "sidebar" | "sidebar-unfixed";
		classNames?: {
			root?: string;
			container?: string;
			inner?: string;
		};
	}
) {
	const {
		children,
		className,
		classNames,
		collapsible = "offcanvas",
		side = "left",
		variant = "sidebar",
		...restOfProps
	} = props;

	const { isMobile, openMobile, setOpenMobile, sidebarWidthMobile, state } = useSidebarContext();

	if (collapsible === "none") {
		return (
			<aside
				data-slot="sidebar-root"
				className={cnMerge(
					"flex h-full w-(--sidebar-width) bg-shadcn-sidebar text-shadcn-sidebar-foreground",
					className,
					classNames?.root
				)}
				{...restOfProps}
			>
				{children}
			</aside>
		);
	}

	if (isMobile) {
		return (
			<Sheet.Root open={openMobile} onOpenChange={setOpenMobile} {...props}>
				<Sheet.Content
					data-slot="sidebar-root"
					data-sidebar="sidebar"
					data-mobile="true"
					className={cnMerge(
						`w-(--sidebar-width) bg-shadcn-sidebar p-0 text-shadcn-sidebar-foreground
						[&>button]:hidden`,
						className,
						classNames?.root
					)}
					style={
						{
							"--sidebar-width": sidebarWidthMobile,
						} as React.CSSProperties
					}
					side={side}
				>
					<Sheet.Header className="sr-only">
						<Sheet.Title>Sidebar</Sheet.Title>
						<Sheet.Description>Displays the mobile sidebar.</Sheet.Description>
					</Sheet.Header>
					<div className="flex size-full flex-col">{children}</div>
				</Sheet.Content>
			</Sheet.Root>
		);
	}

	return (
		<aside
			className={cnMerge(
				"group peer relative inset-y-0 text-shadcn-sidebar-foreground data-[side=right]:order-last",
				className,
				classNames?.root
			)}
			data-slot="sidebar-root"
			data-state={state}
			data-collapsible={state === "collapsed" ? collapsible : ""}
			data-variant={variant}
			data-side={side}
		>
			{/* This is what handles the sidebar gap on desktop */}
			<div
				data-slot="sidebar-gap"
				className={cnMerge(
					"relative w-(--sidebar-width) bg-transparent transition-[width] duration-300 ease-in-out",
					"group-data-[collapsible=offcanvas]:w-0",
					"group-data-[side=right]:rotate-180",
					variant === "floating" || variant === "inset" ?
						"group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]"
					:	"group-data-[collapsible=icon]:w-(--sidebar-width-icon)"
				)}
			/>

			<div
				data-slot="sidebar-container"
				className={cnMerge(
					`fixed inset-y-0 z-10 h-svh w-(--sidebar-width) transition-[left,right,width,margin]
					duration-[300ms,300ms,500ms,150ms] ease-in-out md:flex`,

					variant === "sidebar-unfixed" && "sticky",

					side === "left" ?
						"left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
					:	"right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",

					// side === "left" ?
					// 	`not-group-data-[collapsible=icon]:has-[[data-slot=sidebar-rail]:hover]:-ms-2
					// 		group-data-[collapsible=offcanvas]:has-[[data-slot=sidebar-rail]:hover]:ms-2`
					// :	`not-group-data-[collapsible=icon]:has-[[data-slot=sidebar-rail]:hover]:-me-2
					// 	group-data-[collapsible=offcanvas]:has-[[data-slot=sidebar-rail]:hover]:me-2`,

					// Adjust the padding for floating and inset variants.
					variant === "floating" || variant === "inset" ?
						`p-2
							group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]`
					:	`group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r
						group-data-[side=right]:border-l`,
					className,
					classNames?.container
				)}
				{...restOfProps}
			>
				<div
					data-slot="sidebar-inner"
					data-sidebar="sidebar"
					className={cnMerge(
						`flex size-full flex-col bg-shadcn-sidebar group-data-[variant=floating]:rounded-lg
						group-data-[variant=floating]:border
						group-data-[variant=floating]:border-shadcn-sidebar-border
						group-data-[variant=floating]:shadow-sm`,
						className,
						classNames?.inner
					)}
				>
					{children}
				</div>
			</div>
		</aside>
	);
}

function SidebarTrigger(props: InferProps<"button">) {
	const { className, onClick, children, ...restOfProps } = props;
	const { toggleSidebar } = useSidebarContext();

	return (
		<button
			type="button"
			data-sidebar="trigger"
			data-slot="sidebar-trigger"
			className={cnMerge(
				// shadcnButtonVariants({ size: "icon", variant: "ghost" }),
				"size-7 shrink-0",
				className
			)}
			onClick={(event) => {
				onClick?.(event);
				toggleSidebar();
			}}
			{...restOfProps}
		>
			{children ?? <IconBox icon="lucide:panel-left" />}
			<span className="sr-only">Toggle Sidebar</span>
		</button>
	);
}

function SidebarRail(props: InferProps<"button"> & { side?: "left" | "right" }) {
	const { className, side = "left", ...restOfProps } = props;

	const { state, toggleSidebar } = useSidebarContext();

	return (
		<Tooltip.Root>
			<Tooltip.Trigger
				data-sidebar="rail"
				data-slot="sidebar-rail"
				aria-label="Toggle Sidebar"
				tabIndex={-1}
				onClick={toggleSidebar}
				title="Toggle Sidebar"
				className={cnMerge(
					`absolute top-1/2 h-20 w-8 -translate-y-1/2 cursor-pointer transition-[left,right,translate]
					duration-300 ease-in-out group-data-[state=collapsed]:translate-x-0
					in-data-[side=left]:left-(--sidebar-width) in-data-[side=left]:-translate-x-2
					in-data-[side=left]:group-data-[collapsible=icon]:left-(--sidebar-width-icon)
					in-data-[side=left]:group-data-[collapsible=offcanvas]:left-0
					in-data-[side=right]:right-(--sidebar-width) in-data-[side=right]:translate-x-2
					in-data-[side=right]:group-data-[collapsible=icon]:right-(--sidebar-width-icon)
					in-data-[side=right]:group-data-[collapsible=offcanvas]:right-0`,
					className
				)}
				{...restOfProps}
			>
				<div
					className="pointer-events-none h-6 w-4 opacity-50 transition-all ease-in-out
						group-data-[state=collapsed]:translate-x-0 before:absolute before:top-[calc(50%-7px)]
						before:h-[9px] before:w-0.5 before:rounded-full before:bg-shadcn-muted-foreground
						before:transition-all after:absolute after:bottom-[calc(50%-7px)] after:h-[9px]
						after:w-0.5 after:rounded-full after:bg-shadcn-muted-foreground after:transition-all
						in-data-[side=left]:translate-x-2 in-data-[side=left]:before:left-[calc(50%-1px)]
						in-data-[side=left]:after:left-[calc(50%-1px)] in-data-[side=right]:ml-auto
						in-data-[side=right]:-translate-x-2 in-data-[side=right]:before:left-[calc(50%+1)]
						in-data-[side=right]:after:left-[calc(50%+1)]
						in-[[data-slot=sidebar-rail]:hover]:opacity-100
						in-data-[side=left]:in-[[data-slot=sidebar-rail]:hover]:translate-x-1
						group-data-[state=collapsed]:in-data-[side=left]:in-[[data-slot=sidebar-rail]:hover]:translate-x-3
						group-data-[state=collapsed]:group-data-[collapsible=icon]:in-data-[side=left]:in-[[data-slot=sidebar-rail]:hover]:translate-x-1
						in-data-[side=left]:in-[[data-slot=sidebar-rail]:hover]:before:rotate-45
						group-data-[state=collapsed]:in-data-[side=left]:in-[[data-slot=sidebar-rail]:hover]:before:-rotate-45
						in-data-[side=left]:in-[[data-slot=sidebar-rail]:hover]:after:-rotate-45
						group-data-[state=collapsed]:in-data-[side=left]:in-[[data-slot=sidebar-rail]:hover]:after:rotate-45
						in-data-[side=right]:in-[[data-slot=sidebar-rail]:hover]:-translate-x-1
						group-data-[state=collapsed]:in-data-[side=right]:in-[[data-slot=sidebar-rail]:hover]:-translate-x-3
						group-data-[state=collapsed]:group-data-[collapsible=icon]:in-data-[side=right]:in-[[data-slot=sidebar-rail]:hover]:-translate-x-1
						in-data-[side=right]:in-[[data-slot=sidebar-rail]:hover]:before:-rotate-45
						group-data-[state=collapsed]:in-data-[side=right]:in-[[data-slot=sidebar-rail]:hover]:before:rotate-45
						in-data-[side=right]:in-[[data-slot=sidebar-rail]:hover]:after:rotate-45
						group-data-[state=collapsed]:in-data-[side=right]:in-[[data-slot=sidebar-rail]:hover]:after:-rotate-45"
					aria-hidden="true"
				/>
			</Tooltip.Trigger>

			<Tooltip.Content side={side === "right" ? "left" : "right"}>
				{state === "collapsed" ? "Expand" : "Collapse"}
			</Tooltip.Content>
		</Tooltip.Root>
	);
}

export function SidebarInset(props: InferProps<"main">) {
	const { className, ...restOfProps } = props;

	return (
		<main
			data-slot="sidebar-inset"
			className={cnMerge(
				"relative flex w-full flex-1 flex-col bg-shadcn-background",
				`md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0
				md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm
				md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2`,
				className
			)}
			{...restOfProps}
		/>
	);
}

function SidebarInput(props: InferProps<typeof FormInput>) {
	const { className, ...restOfProps } = props;

	return (
		<FormInput
			data-slot="sidebar-input"
			data-sidebar="input"
			className={cnMerge("h-8 w-full bg-shadcn-background shadow-none", className)}
			{...restOfProps}
		/>
	);
}

function SidebarHeader(props: InferProps<"div">) {
	const { className, ...restOfProps } = props;

	return (
		<div
			data-slot="sidebar-header"
			data-sidebar="header"
			className={cnMerge("flex flex-col gap-2 p-2", className)}
			{...restOfProps}
		/>
	);
}

function SidebarFooter(props: InferProps<"div">) {
	const { className, ...restOfProps } = props;

	return (
		<div
			data-slot="sidebar-footer"
			data-sidebar="footer"
			className={cnMerge("flex flex-col gap-2 p-2", className)}
			{...restOfProps}
		/>
	);
}

function SidebarSeparator(props: InferProps<typeof SeparatorPrimitive>) {
	const { className, ...restOfProps } = props;

	return (
		<SeparatorPrimitive
			data-slot="sidebar-separator"
			data-sidebar="separator"
			className={cnMerge("mx-2 w-auto bg-shadcn-sidebar-border", className)}
			{...restOfProps}
		/>
	);
}

function SidebarContent(props: InferProps<"div">) {
	const { className, ...restOfProps } = props;
	return (
		<div
			data-slot="sidebar-content"
			data-sidebar="content"
			className={cnMerge(
				`flex min-h-0 flex-1 flex-col gap-2 overflow-auto
				group-data-[collapsible=icon]:overflow-hidden`,
				className
			)}
			{...restOfProps}
		/>
	);
}

function SidebarGroup(props: InferProps<"div">) {
	const { className, ...restOfProps } = props;

	return (
		<div
			data-slot="sidebar-group"
			data-sidebar="group"
			className={cnMerge("relative flex w-full min-w-0 flex-col p-2", className)}
			{...restOfProps}
		/>
	);
}

function SidebarGroupLabel(props: InferProps<"h4"> & { asChild?: boolean }) {
	const { asChild = false, className, ...restOfProps } = props;

	const Component = asChild ? Slot.Root : "h4";

	return (
		<Component
			data-slot="sidebar-group-label"
			data-sidebar="group-label"
			className={cnMerge(
				`flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium
				text-shadcn-sidebar-foreground/70 ring-shadcn-sidebar-ring outline-hidden
				transition-[margin,opacity] duration-300 focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0`,
				"group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
				className
			)}
			{...restOfProps}
		/>
	);
}

function SidebarGroupAction(props: InferProps<"button"> & { asChild?: boolean }) {
	const { asChild = false, className, ...restOfProps } = props;

	const Component = asChild ? Slot.Root : "button";

	return (
		<Component
			data-slot="sidebar-group-action"
			data-sidebar="group-action"
			className={cnMerge(
				`absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0
				text-shadcn-sidebar-foreground ring-shadcn-sidebar-ring outline-hidden transition-transform
				hover:bg-shadcn-sidebar-accent hover:text-shadcn-sidebar-accent-foreground focus-visible:ring-2
				[&>svg]:size-4 [&>svg]:shrink-0`,
				// Increases the hit area of the button on mobile.
				"after:absolute after:-inset-2 md:after:hidden",
				"group-data-[collapsible=icon]:hidden",
				className
			)}
			{...restOfProps}
		/>
	);
}

function SidebarGroupContent(props: InferProps<"div">) {
	const { className, ...restOfProps } = props;

	return (
		<div
			data-slot="sidebar-group-content"
			data-sidebar="group-content"
			className={cnMerge("w-full text-sm", className)}
			{...restOfProps}
		/>
	);
}

function SidebarMenu(props: InferProps<"ul">) {
	const { className, ...restOfProps } = props;

	return (
		<ul
			data-slot="sidebar-menu"
			data-sidebar="menu"
			className={cnMerge("flex w-full min-w-0 flex-col gap-1", className)}
			{...restOfProps}
		/>
	);
}

function SidebarMenuItem(props: InferProps<"li">) {
	const { className, ...restOfProps } = props;

	return (
		<li
			data-slot="sidebar-menu-item"
			data-sidebar="menu-item"
			className={cnMerge("group/menu-item relative", className)}
			{...restOfProps}
		/>
	);
}

const sidebarMenuButtonVariants = tv({
	base: `peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm
	ring-shadcn-sidebar-ring outline-hidden transition-[width,height,padding]
	group-has-data-[sidebar=menu-action]/menu-item:pr-8 group-data-[collapsible=icon]:size-8!
	group-data-[collapsible=icon]:p-2! hover:bg-shadcn-sidebar-accent
	hover:text-shadcn-sidebar-accent-foreground focus-visible:ring-2 active:bg-shadcn-sidebar-accent
	active:text-shadcn-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50
	aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-shadcn-sidebar-accent
	data-[active=true]:font-medium data-[active=true]:text-shadcn-sidebar-accent-foreground
	data-[state=open]:hover:bg-shadcn-sidebar-accent
	data-[state=open]:hover:text-shadcn-sidebar-accent-foreground [&>span:last-child]:truncate
	[&>svg]:size-4 [&>svg]:shrink-0`,

	defaultVariants: {
		size: "default",
		variant: "default",
	},
	variants: {
		size: {
			default: "h-8 text-sm",
			lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!",
			sm: "h-7 text-xs",
		},
		variant: {
			default: "hover:bg-shadcn-sidebar-accent hover:text-shadcn-sidebar-accent-foreground",
			outline: `bg-shadcn-background shadow-[0_0_0_1px_hsl(var(--color-shadcn-sidebar-border))]
			hover:bg-shadcn-sidebar-accent hover:text-shadcn-sidebar-accent-foreground
			hover:shadow-[0_0_0_1px_hsl(var(--color-shadcn-sidebar-accent))]`,
		},
	},
});

function SidebarMenuButton(
	props: InferProps<"button">
		& VariantProps<typeof sidebarMenuButtonVariants> & {
			asChild?: boolean;
			isActive?: boolean;
			tooltip?: string | InferProps<typeof Tooltip.Content>;
		}
) {
	let {
		asChild = false,
		className,
		isActive = false,
		size = "default",
		tooltip,
		variant = "default",
		...restOfProps
	} = props;

	const { isMobile, state } = useSidebarContext();

	const Component = asChild ? Slot.Root : "button";

	const menuButton = (
		<Component
			data-slot="sidebar-menu-button"
			data-sidebar="menu-button"
			data-size={size}
			data-active={isActive}
			className={cnMerge(sidebarMenuButtonVariants({ size, variant }), className)}
			{...restOfProps}
		/>
	);

	if (!tooltip) {
		return menuButton;
	}

	if (typeof tooltip === "string") {
		tooltip = {
			children: tooltip,
		};
	}

	return (
		<Tooltip.Root>
			<Tooltip.Trigger asChild={true}>{menuButton}</Tooltip.Trigger>

			<Tooltip.Content
				side="right"
				align="center"
				hidden={state !== "collapsed" || isMobile}
				{...tooltip}
			/>
		</Tooltip.Root>
	);
}

function SidebarMenuAction(
	props: InferProps<"button"> & {
		asChild?: boolean;
		showOnHover?: boolean;
	}
) {
	const { asChild = false, className, showOnHover = false, ...restOfProps } = props;

	const Component = asChild ? Slot.Root : "button";

	return (
		<Component
			data-slot="sidebar-menu-action"
			data-sidebar="menu-action"
			className={cnMerge(
				`absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0
				text-shadcn-sidebar-foreground ring-shadcn-sidebar-ring outline-hidden transition-transform
				peer-hover/menu-button:text-shadcn-sidebar-accent-foreground hover:bg-shadcn-sidebar-accent
				hover:text-shadcn-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4
				[&>svg]:shrink-0`,
				// Increases the hit area of the button on mobile.
				"after:absolute after:-inset-2 md:after:hidden",
				"peer-data-[size=sm]/menu-button:top-1",
				"peer-data-[size=default]/menu-button:top-1.5",
				"peer-data-[size=lg]/menu-button:top-2.5",
				"group-data-[collapsible=icon]:hidden",
				showOnHover
					&& `group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100
					peer-data-[active=true]/menu-button:text-shadcn-sidebar-accent-foreground
					data-[state=open]:opacity-100 md:opacity-0`,
				className
			)}
			{...restOfProps}
		/>
	);
}

function SidebarMenuBadge(props: InferProps<"div">) {
	const { className, ...restOfProps } = props;
	return (
		<div
			data-slot="sidebar-menu-badge"
			data-sidebar="menu-badge"
			className={cnMerge(
				`pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md
				px-1 text-xs font-medium text-shadcn-sidebar-foreground tabular-nums select-none`,
				`peer-hover/menu-button:text-shadcn-sidebar-accent-foreground
				peer-data-[active=true]/menu-button:text-shadcn-sidebar-accent-foreground`,
				"peer-data-[size=sm]/menu-button:top-1",
				"peer-data-[size=default]/menu-button:top-1.5",
				"peer-data-[size=lg]/menu-button:top-2.5",
				"group-data-[collapsible=icon]:hidden",
				className
			)}
			{...restOfProps}
		/>
	);
}

function SidebarMenuSkeleton(
	props: InferProps<"div"> & {
		showIcon?: boolean;
	}
) {
	const { className, showIcon = false, ...restOfProps } = props;

	// Random width between 50 to 90%.
	const width = useConstant(() => `${Math.floor(Math.random() * 40) + 50}%`);

	return (
		<div
			data-slot="sidebar-menu-skeleton"
			data-sidebar="menu-skeleton"
			className={cnMerge("flex h-8 items-center gap-2 rounded-md px-2", className)}
			{...restOfProps}
		>
			{showIcon && <Skeleton className="size-4 rounded-md" data-sidebar="menu-skeleton-icon" />}

			<Skeleton
				className="h-4 max-w-(--skeleton-width) flex-1"
				data-sidebar="menu-skeleton-text"
				style={
					{
						"--skeleton-width": width,
					} as React.CSSProperties
				}
			/>
		</div>
	);
}

function SidebarMenuSub(props: InferProps<"ul">) {
	const { className, ...restOfProps } = props;

	return (
		<ul
			data-slot="sidebar-menu-sub"
			data-sidebar="menu-sub"
			className={cnMerge(
				`mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-shadcn-sidebar-border px-2.5
				py-0.5`,
				"group-data-[collapsible=icon]:hidden",
				className
			)}
			{...restOfProps}
		/>
	);
}

function SidebarMenuSubItem(props: InferProps<"li">) {
	const { className, ...restOfProps } = props;

	return (
		<li
			data-slot="sidebar-menu-sub-item"
			data-sidebar="menu-sub-item"
			className={cnMerge("group/menu-sub-item relative", className)}
			{...restOfProps}
		/>
	);
}

function SidebarMenuSubButton(
	props: InferProps<"a"> & {
		asChild?: boolean;
		isActive?: boolean;
		size?: "md" | "sm";
	}
) {
	const { asChild = false, className, isActive = false, size = "md", ...restOfProps } = props;

	const Component = asChild ? Slot.Root : "a";

	return (
		<Component
			data-slot="sidebar-menu-sub-button"
			data-sidebar="menu-sub-button"
			data-size={size}
			data-active={isActive}
			className={cnMerge(
				`flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2
				text-shadcn-sidebar-foreground ring-shadcn-sidebar-ring outline-hidden
				hover:bg-shadcn-sidebar-accent hover:text-shadcn-sidebar-accent-foreground focus-visible:ring-2
				active:bg-shadcn-sidebar-accent active:text-shadcn-sidebar-accent-foreground
				disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none
				aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0
				[&>svg]:text-shadcn-sidebar-accent-foreground`,
				`data-[active=true]:bg-shadcn-sidebar-accent
				data-[active=true]:text-shadcn-sidebar-accent-foreground`,
				size === "sm" && "text-xs",
				size === "md" && "text-sm",
				"group-data-[collapsible=icon]:hidden",
				className
			)}
			{...restOfProps}
		/>
	);
}

export const Root = SidebarRoot;
export const ContextProvider = SidebarContextProvider;
export const Content = SidebarContent;
export const Footer = SidebarFooter;
export const Group = SidebarGroup;
export const GroupAction = SidebarGroupAction;
export const GroupContent = SidebarGroupContent;
export const GroupLabel = SidebarGroupLabel;
export const Header = SidebarHeader;
export const Input = SidebarInput;
export const Inset = SidebarInset;
export const Menu = SidebarMenu;
export const MenuAction = SidebarMenuAction;
export const MenuBadge = SidebarMenuBadge;
export const MenuButton = SidebarMenuButton;
export const MenuItem = SidebarMenuItem;
export const MenuSkeleton = SidebarMenuSkeleton;
export const MenuSub = SidebarMenuSub;
export const MenuSubButton = SidebarMenuSubButton;
export const MenuSubItem = SidebarMenuSubItem;
export const Rail = SidebarRail;
export const Separator = SidebarSeparator;
export const Trigger = SidebarTrigger;
