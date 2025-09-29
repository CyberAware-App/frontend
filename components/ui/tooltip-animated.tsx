"use client";

import { useIsHydrated } from "@zayne-labs/toolkit-react";
import { AnimatePresence, LayoutGroup, motion, type Transition } from "motion/react";
import {
	cloneElement,
	createContext,
	use,
	useCallback,
	useEffect,
	useId,
	useMemo,
	useRef,
	useState,
} from "react";
import { createPortal } from "react-dom";
import { cnMerge } from "@/lib/utils/cn";

type Side = "bottom" | "left" | "right" | "top";

type Align = "center" | "end" | "start";

type TooltipData = {
	align: Align;
	alignOffset: number;
	arrow: boolean;
	content: React.ReactNode;
	id: string;
	rect: DOMRect;
	side: Side;
	sideOffset: number;
};

type GlobalTooltipContextType = {
	currentTooltip: TooltipData | null;
	globalId: string;
	hideTooltip: () => void;
	showTooltip: (data: TooltipData) => void;
	transition: Transition;
};

const GlobalTooltipContext = createContext<GlobalTooltipContextType | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useGlobalTooltip = () => {
	const context = use(GlobalTooltipContext);
	if (!context) {
		throw new Error("useGlobalTooltip must be used within a TooltipProvider");
	}
	return context;
};

type TooltipPosition = {
	initial: { x?: number; y?: number };
	transform: string;
	x: number;
	y: number;
};

function getTooltipPosition({
	align,
	alignOffset,
	rect,
	side,
	sideOffset,
}: {
	align: Align;
	alignOffset: number;
	rect: DOMRect;
	side: Side;
	sideOffset: number;
}): TooltipPosition {
	switch (side) {
		case "bottom": {
			if (align === "start") {
				return {
					initial: { y: -15 },
					transform: "translate(0, 0)",
					x: rect.left + alignOffset,
					y: rect.bottom + sideOffset,
				};
			}
			if (align === "end") {
				return {
					initial: { y: -15 },
					transform: "translate(-100%, 0)",
					x: rect.right + alignOffset,
					y: rect.bottom + sideOffset,
				};
			}
			// center
			return {
				initial: { y: -15 },
				transform: "translate(-50%, 0)",
				x: rect.left + rect.width / 2,
				y: rect.bottom + sideOffset,
			};
		}

		case "left": {
			if (align === "start") {
				return {
					initial: { x: 15 },
					transform: "translate(-100%, 0)",
					x: rect.left - sideOffset,
					y: rect.top + alignOffset,
				};
			}
			if (align === "end") {
				return {
					initial: { x: 15 },
					transform: "translate(-100%, -100%)",
					x: rect.left - sideOffset,
					y: rect.bottom + alignOffset,
				};
			}
			// center
			return {
				initial: { x: 15 },
				transform: "translate(-100%, -50%)",
				x: rect.left - sideOffset,
				y: rect.top + rect.height / 2,
			};
		}

		case "right": {
			if (align === "start") {
				return {
					initial: { x: -15 },
					transform: "translate(0, 0)",
					x: rect.right + sideOffset,
					y: rect.top + alignOffset,
				};
			}
			if (align === "end") {
				return {
					initial: { x: -15 },
					transform: "translate(0, -100%)",
					x: rect.right + sideOffset,
					y: rect.bottom + alignOffset,
				};
			}
			// center
			return {
				initial: { x: -15 },
				transform: "translate(0, -50%)",
				x: rect.right + sideOffset,
				y: rect.top + rect.height / 2,
			};
		}

		case "top": {
			if (align === "start") {
				return {
					initial: { y: 15 },
					transform: "translate(0, -100%)",
					x: rect.left + alignOffset,
					y: rect.top - sideOffset,
				};
			}
			if (align === "end") {
				return {
					initial: { y: 15 },
					transform: "translate(-100%, -100%)",
					x: rect.right + alignOffset,
					y: rect.top - sideOffset,
				};
			}
			// center
			return {
				initial: { y: 15 },
				transform: "translate(-50%, -100%)",
				x: rect.left + rect.width / 2,
				y: rect.top - sideOffset,
			};
		}

		default: {
			side satisfies never;
			throw new Error("Invalid side");
		}
	}
}

type TooltipProviderProps = {
	children: React.ReactNode;
	closeDelay?: number;
	openDelay?: number;
	transition?: Transition;
};

function TooltipContextProvider(props: TooltipProviderProps) {
	const { children, closeDelay = 300, openDelay = 700, transition } = props;

	const globalId = useId();
	const [currentTooltip, setCurrentTooltip] = useState<TooltipData | null>(null);
	const timeoutRef = useRef<number>(null);
	const lastCloseTimeRef = useRef<number>(0);

	const showTooltip = useCallback(
		(data: TooltipData) => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
			if (currentTooltip !== null) {
				setCurrentTooltip(data);
				return;
			}
			const now = Date.now();
			const delay = now - lastCloseTimeRef.current < closeDelay ? 0 : openDelay;
			timeoutRef.current = window.setTimeout(() => setCurrentTooltip(data), delay);
		},
		[openDelay, closeDelay, currentTooltip]
	);

	const hideTooltip = useCallback(() => {
		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		timeoutRef.current = window.setTimeout(() => {
			setCurrentTooltip(null);
			lastCloseTimeRef.current = Date.now();
		}, closeDelay);
	}, [closeDelay]);

	const hideImmediate = useCallback(() => {
		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		setCurrentTooltip(null);
		lastCloseTimeRef.current = Date.now();
	}, []);

	useEffect(() => {
		window.addEventListener("scroll", hideImmediate, true);
		return () => window.removeEventListener("scroll", hideImmediate, true);
	}, [hideImmediate]);

	const value = useMemo<GlobalTooltipContextType>(
		() => ({
			currentTooltip,
			globalId,
			hideTooltip,
			showTooltip,
			transition: transition ?? { damping: 25, stiffness: 300, type: "spring" },
		}),
		[showTooltip, hideTooltip, currentTooltip, transition, globalId]
	);
	return (
		<GlobalTooltipContext value={value}>
			<LayoutGroup>{children}</LayoutGroup>
			<TooltipOverlay />
		</GlobalTooltipContext>
	);
}

type TooltipArrowProps = {
	side: Side;
};

function TooltipArrow(props: TooltipArrowProps) {
	const { side } = props;

	return (
		<div
			className={cnMerge(
				"absolute z-50 size-2.5 rotate-45 rounded-[2px] bg-shadcn-primary",
				(side === "top" || side === "bottom") && "left-1/2 -translate-x-1/2",
				(side === "left" || side === "right") && "top-1/2 -translate-y-1/2",
				side === "top" && "-bottom-[3px]",
				side === "bottom" && "-top-[3px]",
				side === "left" && "-right-[3px]",
				side === "right" && "-left-[3px]"
			)}
		/>
	);
}

function TooltipPortal(props: { children: React.ReactNode }) {
	const { children } = props;

	const isHydrated = useIsHydrated();

	return isHydrated ? createPortal(children, document.body) : null;
}

function TooltipOverlay() {
	const { currentTooltip, globalId, transition } = useGlobalTooltip();

	const position = useMemo(() => {
		if (!currentTooltip) return null;
		return getTooltipPosition({
			align: currentTooltip.align,
			alignOffset: currentTooltip.alignOffset,
			rect: currentTooltip.rect,
			side: currentTooltip.side,
			sideOffset: currentTooltip.sideOffset,
		});
	}, [currentTooltip]);

	const shouldShow = Boolean(currentTooltip && currentTooltip.content && position);

	return (
		<AnimatePresence>
			{shouldShow && (
				<TooltipPortal>
					<motion.div
						data-slot="tooltip-overlay-container"
						className="fixed z-50"
						style={{
							left: position?.x,
							top: position?.y,
							transform: position?.transform,
						}}
					>
						<motion.div
							data-slot="tooltip-overlay"
							layoutId={`tooltip-overlay-${globalId}`}
							initial={{ opacity: 0, scale: 0, ...position?.initial }}
							animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
							exit={{ opacity: 0, scale: 0, ...position?.initial }}
							transition={transition}
							className="relative w-fit rounded-md bg-shadcn-primary fill-shadcn-primary px-3 py-1.5
								text-center text-sm text-balance text-shadcn-primary-foreground shadow-md"
						>
							{currentTooltip?.content}

							{currentTooltip?.arrow && <TooltipArrow side={currentTooltip.side} />}
						</motion.div>
					</motion.div>
				</TooltipPortal>
			)}
		</AnimatePresence>
	);
}

type TooltipContextType = {
	align: Align;
	alignOffset: number;
	arrow: boolean;
	content: React.ReactNode;
	id: string;
	setArrow: React.Dispatch<React.SetStateAction<boolean>>;
	setContent: React.Dispatch<React.SetStateAction<React.ReactNode>>;
	side: Side;
	sideOffset: number;
};

const TooltipContext = createContext<TooltipContextType | undefined>(undefined);

const useTooltip = () => {
	const context = use(TooltipContext);
	if (!context) {
		throw new Error("useTooltip must be used within a TooltipProvider");
	}
	return context;
};

type TooltipProps = {
	align?: Align;
	alignOffset?: number;
	children: React.ReactNode;
	side?: Side;
	sideOffset?: number;
};

function TooltipRoot(props: TooltipProps) {
	const { align = "center", alignOffset = 0, children, side = "top", sideOffset = 14 } = props;

	const id = useId();
	const [content, setContent] = useState<React.ReactNode>(null);
	const [arrow, setArrow] = useState(true);

	const value = useMemo<TooltipContextType>(
		() => ({
			align,
			alignOffset,
			arrow,
			content,
			id,
			setArrow,
			setContent,
			side,
			sideOffset,
		}),
		[content, setContent, arrow, setArrow, side, sideOffset, align, alignOffset, id]
	);

	return <TooltipContext value={value}>{children}</TooltipContext>;
}

type TooltipContentProps = {
	arrow?: boolean;
	children: React.ReactNode;
};

function TooltipContent(props: TooltipContentProps) {
	const { arrow = true, children } = props;

	const { setArrow, setContent } = useTooltip();

	useEffect(() => {
		setContent(children);
		setArrow(arrow);
	}, [children, setContent, setArrow, arrow]);

	return null;
}

type TooltipTriggerProps = {
	children: React.ReactElement;
};

function TooltipTrigger(props: TooltipTriggerProps) {
	const { children } = props;
	const { align, alignOffset, arrow, content, id, side, sideOffset } = useTooltip();
	const { currentTooltip, hideTooltip, showTooltip } = useGlobalTooltip();
	const triggerRef = useRef<HTMLElement>(null);

	const handleOpen = useCallback(() => {
		if (!triggerRef.current) return;
		const rect = triggerRef.current.getBoundingClientRect();
		showTooltip({
			align,
			alignOffset,
			arrow,
			content,
			id,
			rect,
			side,
			sideOffset,
		});
	}, [showTooltip, content, side, sideOffset, align, alignOffset, id, arrow]);

	const handleMouseEnter = useCallback(
		(e: React.MouseEvent<HTMLElement>) => {
			(children.props as React.HTMLAttributes<HTMLElement> | undefined)?.onMouseEnter?.(e);
			handleOpen();
		},
		[handleOpen, children.props]
	);

	const handleMouseLeave = useCallback(
		(e: React.MouseEvent<HTMLElement>) => {
			(children.props as React.HTMLAttributes<HTMLElement> | undefined)?.onMouseLeave?.(e);
			hideTooltip();
		},
		[hideTooltip, children.props]
	);

	const handleFocus = useCallback(
		(e: React.FocusEvent<HTMLElement>) => {
			(children.props as React.HTMLAttributes<HTMLElement> | undefined)?.onFocus?.(e);
			handleOpen();
		},
		[handleOpen, children.props]
	);

	const handleBlur = useCallback(
		(e: React.FocusEvent<HTMLElement>) => {
			(children.props as React.HTMLAttributes<HTMLElement> | undefined)?.onBlur?.(e);
			hideTooltip();
		},
		[hideTooltip, children.props]
	);

	useEffect(() => {
		if (currentTooltip?.id !== id) return;
		if (!triggerRef.current) return;

		if (currentTooltip.content === content && currentTooltip.arrow === arrow) return;

		const rect = triggerRef.current.getBoundingClientRect();
		showTooltip({
			align,
			alignOffset,
			arrow,
			content,
			id,
			rect,
			side,
			sideOffset,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [content, arrow, currentTooltip?.id]);

	return cloneElement(children, {
		"data-align": align,
		"data-side": side,
		"data-slot": "tooltip-trigger",
		"data-state": currentTooltip?.id === id ? "open" : "closed",
		onBlur: handleBlur,
		onFocus: handleFocus,
		onMouseEnter: handleMouseEnter,
		onMouseLeave: handleMouseLeave,
		ref: triggerRef,
	} as React.HTMLAttributes<HTMLElement>);
}

export const Root = TooltipRoot;
export const Trigger = TooltipTrigger;
export const Content = TooltipContent;
export const ContextProvider = TooltipContextProvider;
