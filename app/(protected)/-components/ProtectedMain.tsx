"use client";

import { useQuery } from "@tanstack/react-query";
import type { InferProps } from "@zayne-labs/toolkit-react/utils";
import { sessionQuery } from "@/lib/react-query/queryOptions";
import { Main } from "@/app/-components";

function ProtectedMain(props: InferProps<typeof Main>) {
	const { data } = useQuery(sessionQuery());

	if (data) {
		return <Main {...props} />;
	}

	return null;
}

export { ProtectedMain };
