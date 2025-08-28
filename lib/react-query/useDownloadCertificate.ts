import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToggle } from "@zayne-labs/toolkit-react";
import { downloadCertificateQuery } from "./queryOptions";

const useDownloadCertificate = (id: string | undefined) => {
	const [shouldStartFetch, toggleShouldStartFetch] = useToggle(false);

	const downloadCertificateQueryObject = downloadCertificateQuery({ id, enabled: shouldStartFetch });

	const downloadCertificateQueryResult = useQuery(downloadCertificateQueryObject);

	const queryClient = useQueryClient();

	const downloadCertificate = () => {
		toggleShouldStartFetch(true);
		void queryClient.refetchQueries(downloadCertificateQueryObject);
	};

	return {
		downloadCertificate,
		isFetching: downloadCertificateQueryResult.isFetching,
	};
};

export { useDownloadCertificate };
