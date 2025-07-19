import { queryOptions } from "@tanstack/react-query";

export const sessionQuery = () => {
	return queryOptions({
		queryKey: ["session"],
	});
};
