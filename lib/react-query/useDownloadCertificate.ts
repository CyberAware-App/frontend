import { queryOptions, skipToken, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileURL } from "@zayne-labs/toolkit-core";
import { useToggle } from "@zayne-labs/toolkit-react";
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

export const downloadCertificateQuery = (options: { enabled: boolean; id: string | undefined }) => {
	const { enabled, id = "" } = options;

	return queryOptions({
		queryFn:
			enabled ?
				() => {
					return callBackendApiForQuery("@get/certificate/:id/download", {
						meta: { toast: { success: false } },
						onSuccess: (ctx) => forceDownload(ctx.data, id),
						params: { id },
						responseType: "blob",
					});
				}
			:	skipToken,
		queryKey: ["certificate", "download", id],
		staleTime: Infinity,
	});
};

const useDownloadCertificate = (id: string | undefined) => {
	const [shouldStartFetch, toggleShouldStartFetch] = useToggle(false);

	const downloadCertificateQueryObject = downloadCertificateQuery({ enabled: shouldStartFetch, id });

	const downloadCertificateQueryResult = useQuery(downloadCertificateQueryObject);

	const queryClient = useQueryClient();

	const downloadCertificate = () => {
		toggleShouldStartFetch(true);
		void queryClient.refetchQueries(downloadCertificateQueryObject);
	};

	const invalidateCertificateQuery = () => {
		void queryClient.invalidateQueries(downloadCertificateQueryObject);
	};

	return {
		downloadCertificate,
		invalidateCertificateQuery,
		isFetching: downloadCertificateQueryResult.isFetching,
	};
};

export { useDownloadCertificate };
