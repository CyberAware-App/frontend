import Image from "next/image";
import { aecesLogo, unizikLogo } from "@/public/assets/landing";

function Credits() {
	return (
		<article className="flex items-start gap-2.5 text-[10px]">
			<h4 className="mt-1 shrink-0">Powered By:</h4>

			<div className="flex flex-col gap-1">
				<figure className="flex items-center gap-2.5">
					<Image src={aecesLogo} alt="AECES Logo" className="size-6.5" />
					<figcaption>Association of Electronic and Computer Engineering Students,</figcaption>
				</figure>

				<figure className="flex items-center gap-2.5">
					<Image src={unizikLogo} alt="Unizik Logo" className="size-7.5" />
					<figcaption>Nnamdi Azikiwe University, Awka</figcaption>
				</figure>
			</div>
		</article>
	);
}

export { Credits };
