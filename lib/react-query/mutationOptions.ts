import { mutationOptions } from "@tanstack/react-query";
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

export const downloadCertificateMutation = () => {
	return mutationOptions({
		mutationFn: async (options: { id: string | undefined }) => {
			const { id = "" } = options;

			return callBackendApiForQuery("@get/certificate/:id/download", {
				meta: { toast: { success: false } },
				onSuccess: (ctx) => forceDownload(ctx.data, id),
				params: { id },
				responseType: "blob",
			});
		},

		mutationKey: ["certificate", "download"],
	});
};

// Old mutation imitation
