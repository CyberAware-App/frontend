import { mutationOptions } from "@tanstack/react-query";
import { callBackendApiForQuery } from "../api/callBackendApi";
import { forceDownload } from "../utils/common";

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
