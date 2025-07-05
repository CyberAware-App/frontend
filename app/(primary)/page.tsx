import Image from "next/image";
import { Button } from "@/components/ui/button";
import { aecesLogo, eyeShield, unizikLogo } from "@/public/assets";
import { Main } from "../-components";

function HomePage() {
	return (
		<Main>
			<section className="mx-4 mt-4 flex flex-col gap-8 bg-white px-[45px] pt-[170px] pb-4">
				<h1 className="text-center text-[36px] font-bold text-cyberaware-aeces-blue">
					Be CyberAware.
					<span className="inline-flex items-center">
						Stay <Image src={eyeShield} alt="Eye Shield" className="mt-1 ml-2 size-6" /> Secure
					</span>
					.
				</h1>
				<p className="text-center text-[16px] text-cyberaware-body-color">
					Learn how to protect your digital world in just 10 days. Designed for lecturers, staff, and
					students.
				</p>

				<div className="flex items-center justify-center gap-3.5">
					<Button theme="blue-ghost" className="max-w-[118px]">
						Learn More
					</Button>
					<Button className="max-w-[175px]">Get Started</Button>
				</div>

				<article className="flex items-start gap-2.5 text-[10px]">
					<h4 className="mt-1 shrink-0">Powered By:</h4>

					<div className="flex flex-col gap-2.5">
						<figure className="flex items-center gap-2.5">
							<Image src={aecesLogo} alt="AECES Logo" className="size-6" />
							<figcaption>Association and Electronic and computer engineering students,</figcaption>
						</figure>
						<figure className="flex items-center gap-2.5">
							<Image src={unizikLogo} alt="Unizik Logo" className="size-7" />
							<figcaption>Nnamdi Azikiwe University, Awka</figcaption>
						</figure>
					</div>
				</article>
			</section>
		</Main>
	);
}

export default HomePage;
