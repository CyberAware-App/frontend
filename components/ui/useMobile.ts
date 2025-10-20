import { useEffect, useState } from "react";

const useIsMobile = (options: { enable?: boolean; mobileBreakpoint?: number }) => {
	const { enable = true, mobileBreakpoint = 768 } = options;

	const [isMobile, setIsMobile] = useState<boolean | undefined>();

	useEffect(() => {
		if (!enable) {
			return;
		}

		const mql = window.matchMedia(`(max-width: ${mobileBreakpoint - 1}px)`);

		const abortController = new AbortController();

		const onChange = () => setIsMobile(window.innerWidth < mobileBreakpoint);

		mql.addEventListener("change", onChange, { signal: abortController.signal });

		// eslint-disable-next-line react-hooks/set-state-in-effect
		setIsMobile(window.innerWidth < mobileBreakpoint);

		return () => abortController.abort();
	}, [mobileBreakpoint, enable]);

	return Boolean(isMobile);
};

export { useIsMobile };
