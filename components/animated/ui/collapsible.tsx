import { createCustomContext, useCallbackRef, useToggle } from "@zayne-labs/toolkit-react";
import type { InferProps } from "@zayne-labs/toolkit-react/utils";
import { isFunction } from "@zayne-labs/toolkit-type-helpers";
import { AnimatePresence, type HTMLMotionProps, motion, type Transition } from "motion/react";
import { Collapsible as CollapsiblePrimitive } from "radix-ui";
import { useCallback, useMemo } from "react";

type ContextValue = {
	isOpen: boolean;
	onClose: () => void;
	onOpen: () => void;
	setOpen: (open: boolean) => void;
};

const [CollapsibleContextProvider, useCollapsibleContext] = createCustomContext<ContextValue>();

function CollapsibleRoot(props: InferProps<typeof CollapsiblePrimitive.Root>) {
	// eslint-disable-next-line ts-eslint/unbound-method
	const { defaultOpen, onOpenChange: setOpenProp, open: openProp, ...restOfProps } = props;

	const savedSetOpenProp = useCallbackRef(setOpenProp);

	const [internalOpen, toggleInternalOpen] = useToggle(defaultOpen);

	// == Use the open prop if it is provided
	// == Otherwise, use the internal open state
	const isOpen = openProp ?? internalOpen;

	const setOpen = useCallback(
		(value: boolean | ((value: boolean) => boolean)) => {
			const resolvedValue = isFunction(value) ? value(isOpen) : value;

			// == Call the onOpenChange prop if the openProp is provided
			// == Otherwise, toggle the internal open state
			const selectedOpenChange = openProp ? savedSetOpenProp : toggleInternalOpen;

			selectedOpenChange(resolvedValue);
		},
		[isOpen, openProp, savedSetOpenProp, toggleInternalOpen]
	);

	const onClose = useCallbackRef(() => setOpen(false));
	const onOpen = useCallbackRef(() => setOpen(true));

	const contextValue = useMemo(
		() => ({ isOpen, onClose, onOpen, setOpen }) satisfies ContextValue,
		[onClose, onOpen, isOpen, setOpen]
	);

	return (
		<CollapsibleContextProvider value={contextValue}>
			<CollapsiblePrimitive.Root
				{...restOfProps}
				data-slot="collapsible-root"
				open={isOpen}
				onOpenChange={setOpen}
			/>
		</CollapsibleContextProvider>
	);
}

type CollapsibleTriggerProps = InferProps<typeof CollapsiblePrimitive.Trigger>;

function CollapsibleTrigger(props: CollapsibleTriggerProps) {
	return <CollapsiblePrimitive.Trigger data-slot="collapsible-trigger" {...props} />;
}

type CollapsibleContentProps = HTMLMotionProps<"li">
	& InferProps<typeof CollapsiblePrimitive.Content> & {
		transition?: Transition;
	};

function CollapsibleContent(props: CollapsibleContentProps) {
	const { children, className, transition, ...restOfProps } = props;

	const { isOpen } = useCollapsibleContext();

	return (
		<AnimatePresence>
			{isOpen && (
				<CollapsiblePrimitive.Content asChild={true} forceMount={true} {...restOfProps}>
					<motion.li
						key="collapsible-content"
						data-slot="collapsible-content"
						layout={true}
						initial={{ height: 0, opacity: 0, overflow: "hidden" }}
						animate={{ height: "auto", opacity: 1, overflow: "hidden" }}
						exit={{ height: 0, opacity: 0, overflow: "hidden" }}
						transition={transition ?? { damping: 22, stiffness: 150, type: "spring" }}
						className={className}
						{...restOfProps}
					>
						{children}
					</motion.li>
				</CollapsiblePrimitive.Content>
			)}
		</AnimatePresence>
	);
}

export const Root = CollapsibleRoot;
export const Trigger = CollapsibleTrigger;
export const Content = CollapsibleContent;

// eslint-disable-next-line react-refresh/only-export-components
export { useCollapsibleContext };
