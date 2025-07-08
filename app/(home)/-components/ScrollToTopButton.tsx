"use client";

import { useScrollObserver } from "@zayne-labs/toolkit-react";
import { IconBox } from "@/components/common/IconBox";
import { Button } from "@/components/ui/button";
import { cnMerge } from "@/lib/utils/cn";

function ScrollToTopButton() {
	const { isScrolled, observedElementRef } = useScrollObserver<HTMLDivElement>({
		rootMargin: "1000px 0px 0px",
	});

	return (
		<div
			ref={observedElementRef}
			className="fixed right-[20px] bottom-[20px] z-500"
			onClick={() => window.scrollTo(0, 0)}
		>
			<Button
				unstyled={true}
				className={cnMerge(
					`flex size-[52px] translate-y-[-5000%] items-center justify-center
					rounded-[62%_38%_46%_54%/60%_63%_37%_40%] bg-cyberaware-unizik-orange/90 backdrop-blur-md
					transition-[translate] duration-400`,
					isScrolled && "translate-y-0 duration-1200 ease-in-out"
				)}
			>
				<IconBox icon="bi:arrow-up" className="size-6 text-white" />
			</Button>
		</div>
	);
}

export { ScrollToTopButton };
