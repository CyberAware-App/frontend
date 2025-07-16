import { useEffect, useState } from "react";

const useIsMobile = (mobileBreakpoint = 768) => {
	const [isMobile, setIsMobile] = useState<boolean | undefined>();

	useEffect(() => {
		const mql = window.matchMedia(`(max-width: ${mobileBreakpoint - 1}px)`);

		const abortController = new AbortController();

		const onChange = () => setIsMobile(window.innerWidth < mobileBreakpoint);

		mql.addEventListener("change", onChange, { signal: abortController.signal });

		// eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
		setIsMobile(window.innerWidth < mobileBreakpoint);

		return () => abortController.abort();
	}, [mobileBreakpoint]);

	return Boolean(isMobile);
};

export { useIsMobile };
