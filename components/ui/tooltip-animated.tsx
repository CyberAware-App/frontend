"use client";

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

type Side = "top" | "bottom" | "left" | "right";

type Align = "start" | "center" | "end";

type TooltipData = {
	content: React.ReactNode;
	rect: DOMRect;
	side: Side;
	sideOffset: number;
	align: Align;
	alignOffset: number;
	id: string;
	arrow: boolean;
};

type GlobalTooltipContextType = {
	showTooltip: (data: TooltipData) => void;
	hideTooltip: () => void;
	currentTooltip: TooltipData | null;
	transition: Transition;
	globalId: string;
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
	x: number;
	y: number;
	transform: string;
	initial: { x?: number; y?: number };
};

function getTooltipPosition({
	rect,
	side,
	sideOffset,
	align,
	alignOffset,
}: {
	rect: DOMRect;
	side: Side;
	sideOffset: number;
	align: Align;
	alignOffset: number;
}): TooltipPosition {
	switch (side) {
		case "top": {
			if (align === "start") {
				return {
					x: rect.left + alignOffset,
					y: rect.top - sideOffset,
					transform: "translate(0, -100%)",
					initial: { y: 15 },
				};
			}
			if (align === "end") {
				return {
					x: rect.right + alignOffset,
					y: rect.top - sideOffset,
					transform: "translate(-100%, -100%)",
					initial: { y: 15 },
				};
			}
			// center
			return {
				x: rect.left + rect.width / 2,
				y: rect.top - sideOffset,
				transform: "translate(-50%, -100%)",
				initial: { y: 15 },
			};
		}

		case "bottom": {
			if (align === "start") {
				return {
					x: rect.left + alignOffset,
					y: rect.bottom + sideOffset,
					transform: "translate(0, 0)",
					initial: { y: -15 },
				};
			}
			if (align === "end") {
				return {
					x: rect.right + alignOffset,
					y: rect.bottom + sideOffset,
					transform: "translate(-100%, 0)",
					initial: { y: -15 },
				};
			}
			// center
			return {
				x: rect.left + rect.width / 2,
				y: rect.bottom + sideOffset,
				transform: "translate(-50%, 0)",
				initial: { y: -15 },
			};
		}

		case "left": {
			if (align === "start") {
				return {
					x: rect.left - sideOffset,
					y: rect.top + alignOffset,
					transform: "translate(-100%, 0)",
					initial: { x: 15 },
				};
			}
			if (align === "end") {
				return {
					x: rect.left - sideOffset,
					y: rect.bottom + alignOffset,
					transform: "translate(-100%, -100%)",
					initial: { x: 15 },
				};
			}
			// center
			return {
				x: rect.left - sideOffset,
				y: rect.top + rect.height / 2,
				transform: "translate(-100%, -50%)",
				initial: { x: 15 },
			};
		}

		case "right": {
			if (align === "start") {
				return {
					x: rect.right + sideOffset,
					y: rect.top + alignOffset,
					transform: "translate(0, 0)",
					initial: { x: -15 },
				};
			}
			if (align === "end") {
				return {
					x: rect.right + sideOffset,
					y: rect.bottom + alignOffset,
					transform: "translate(0, -100%)",
					initial: { x: -15 },
				};
			}
			// center
			return {
				x: rect.right + sideOffset,
				y: rect.top + rect.height / 2,
				transform: "translate(0, -50%)",
				initial: { x: -15 },
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
	openDelay?: number;
	closeDelay?: number;
	transition?: Transition;
};

function TooltipContextProvider(props: TooltipProviderProps) {
	const { children, openDelay = 700, closeDelay = 300, transition } = props;

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
			showTooltip,
			hideTooltip,
			currentTooltip,
			transition: transition ?? { type: "spring", stiffness: 300, damping: 25 },
			globalId,
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

	const [isMounted, setIsMounted] = useState(false);

	// eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
	useEffect(() => setIsMounted(true), []);

	return isMounted ? createPortal(children, document.body) : null;
}

function TooltipOverlay() {
	const { currentTooltip, transition, globalId } = useGlobalTooltip();

	const position = useMemo(() => {
		if (!currentTooltip) return null;
		return getTooltipPosition({
			rect: currentTooltip.rect,
			side: currentTooltip.side,
			sideOffset: currentTooltip.sideOffset,
			align: currentTooltip.align,
			alignOffset: currentTooltip.alignOffset,
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
							top: position?.y,
							left: position?.x,
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
	content: React.ReactNode;
	setContent: React.Dispatch<React.SetStateAction<React.ReactNode>>;
	arrow: boolean;
	setArrow: React.Dispatch<React.SetStateAction<boolean>>;
	side: Side;
	sideOffset: number;
	align: Align;
	alignOffset: number;
	id: string;
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
	children: React.ReactNode;
	side?: Side;
	sideOffset?: number;
	align?: Align;
	alignOffset?: number;
};

function TooltipRoot(props: TooltipProps) {
	const { children, side = "top", sideOffset = 14, align = "center", alignOffset = 0 } = props;

	const id = useId();
	const [content, setContent] = useState<React.ReactNode>(null);
	const [arrow, setArrow] = useState(true);

	const value = useMemo<TooltipContextType>(
		() => ({
			content,
			setContent,
			arrow,
			setArrow,
			side,
			sideOffset,
			align,
			alignOffset,
			id,
		}),
		[content, setContent, arrow, setArrow, side, sideOffset, align, alignOffset, id]
	);

	return <TooltipContext value={value}>{children}</TooltipContext>;
}

type TooltipContentProps = {
	children: React.ReactNode;
	arrow?: boolean;
};

function TooltipContent(props: TooltipContentProps) {
	const { children, arrow = true } = props;

	const { setContent, setArrow } = useTooltip();

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
	const { content, side, sideOffset, align, alignOffset, id, arrow } = useTooltip();
	const { showTooltip, hideTooltip, currentTooltip } = useGlobalTooltip();
	const triggerRef = useRef<HTMLElement>(null);

	const handleOpen = useCallback(() => {
		if (!triggerRef.current) return;
		const rect = triggerRef.current.getBoundingClientRect();
		showTooltip({
			content,
			rect,
			side,
			sideOffset,
			align,
			alignOffset,
			id,
			arrow,
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
			content,
			rect,
			side,
			sideOffset,
			align,
			alignOffset,
			id,
			arrow,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [content, arrow, currentTooltip?.id]);

	return cloneElement(children, {
		ref: triggerRef,
		onMouseEnter: handleMouseEnter,
		onMouseLeave: handleMouseLeave,
		onFocus: handleFocus,
		onBlur: handleBlur,
		"data-state": currentTooltip?.id === id ? "open" : "closed",
		"data-side": side,
		"data-align": align,
		"data-slot": "tooltip-trigger",
	} as React.HTMLAttributes<HTMLElement>);
}

export const Root = TooltipRoot;
export const Trigger = TooltipTrigger;
export const Content = TooltipContent;
export const ContextProvider = TooltipContextProvider;
