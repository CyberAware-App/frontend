import { queryOptions, skipToken } from "@tanstack/react-query";
import type { CallApiExtraOptions } from "@zayne-labs/callapi";
import { createFileURL } from "@zayne-labs/toolkit-core";
import { callBackendApiForQuery } from "../api/callBackendApi";

const forceDownload = (data: Blob, id: string) => {
	const fileUrl = createFileURL(data);

	if (!fileUrl) return;

	const link = document.createElement("a");
	link.href = fileUrl;
	link.download = `${id}.pdf`;
	link.click();

	URL.revokeObjectURL(fileUrl);
};

export const downloadCertificateQuery = (
	options: { id: string | undefined; enabled: boolean } & Pick<CallApiExtraOptions, "onResponse">
) => {
	const { id = "", enabled, onResponse } = options;

	return queryOptions({
		queryFn:
			enabled ?
				() => {
					return callBackendApiForQuery("@get/certificate/:id/download", {
						params: { id },
						meta: { toast: { success: false } },
						responseType: "blob",
						onResponse,
						onSuccess: (ctx) => forceDownload(ctx.data, id),
					});
				}
			:	skipToken,
		queryKey: ["certificate", "download", id, onResponse],
		staleTime: Infinity,
	});
};
