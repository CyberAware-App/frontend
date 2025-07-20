import { queryOptions } from "@tanstack/react-query";
import { callBackendApiForQuery } from "../callBackendApi";

export const sessionQuery = () => {
	return queryOptions({
		queryFn: () => callBackendApiForQuery("/session"),
		queryKey: ["session"],
		refetchInterval: 9 * 60 * 1000, // 9 minutes
		retry: false,
		staleTime: Infinity,
	});
};
