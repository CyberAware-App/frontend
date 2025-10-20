import { type UseInViewOptions, useInView } from "motion/react";
import { useImperativeHandle, useRef } from "react";

type UseIsInViewOptions = {
	inView?: boolean;
	inViewMargin?: UseInViewOptions["margin"];
	inViewOnce?: boolean;
};

export const useIsInView = <TElement extends HTMLElement = HTMLElement>(
	ref: React.Ref<TElement>,
	options: UseIsInViewOptions = {}
) => {
	const { inView, inViewMargin = "0px", inViewOnce = false } = options;
	const localRef = useRef<TElement>(null);

	useImperativeHandle(ref, () => localRef.current as TElement);

	const inViewResult = useInView(localRef, {
		margin: inViewMargin,
		once: inViewOnce,
	});

	const isInView = !inView || inViewResult;

	return { isInView, ref: localRef };
};
