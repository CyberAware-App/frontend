"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { IconBox } from "@/components/common/IconBox";
import { Button } from "@/components/ui/button";
import { certificateQuery } from "@/lib/react-query/queryOptions";
import { useDownloadCertificate } from "@/lib/react-query/useDownloadCertificate";
import { emojiPassed } from "@/public/assets";

function ExamCertSuccess() {
	const certificateQueryResult = useQuery(certificateQuery());
	const certificateId = certificateQueryResult.data?.certificate_id;
	const { downloadCertificate, isFetching } = useDownloadCertificate(certificateId);

	return (
		<article className="flex flex-col gap-10 pb-[100px]">
			<div className="flex flex-col items-center gap-6 text-center">
				<div
					className="flex size-24 items-center justify-center rounded-full bg-cyberaware-light-orange"
				>
					<IconBox icon="ri:medal-line" className="size-12 text-cyberaware-unizik-orange" />
				</div>

				<h3 className="text-[28px] font-semibold text-cyberaware-aeces-blue">
					You're Already Certified!
				</h3>

				<p className="max-w-[400px] text-[16px] font-medium text-cyberaware-body-color">
					Great job completing the CyberAware program.
				</p>
			</div>

			<div className="flex flex-col items-center gap-8">
				<div className="flex flex-col items-center gap-3 text-cyberaware-aeces-blue">
					<Image src={emojiPassed} alt="Success" className="size-[96px] object-cover" />

					<h4 className="text-[22px] font-semibold">Well done!</h4>

					<p className="text-center text-[14px] text-cyberaware-body-color">
						You've got the skills to stay safe online
					</p>
				</div>

				<Button
					theme="orange"
					className="max-w-[260px]"
					isLoading={isFetching}
					isDisabled={isFetching}
					onClick={() => downloadCertificate()}
				>
					Download Certificate
				</Button>

				<div
					className="flex items-center justify-center gap-3 rounded-full bg-cyberaware-light-orange
						px-4 py-2"
				>
					<IconBox icon="ri:lightbulb-line" className="size-4 text-cyberaware-unizik-orange" />

					<p className="text-[12px] font-medium text-cyberaware-aeces-blue">
						You can try adding it to your resume or LinkedIn
					</p>
				</div>
			</div>
		</article>
	);
}

export { ExamCertSuccess };
