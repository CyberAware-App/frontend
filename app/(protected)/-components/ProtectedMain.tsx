"use client";

import { useQuery } from "@tanstack/react-query";
import type { InferProps } from "@zayne-labs/toolkit-react/utils";
import { Main } from "@/app/-components";
import { sessionQuery } from "@/lib/react-query/queryOptions";
import { AuthLoader } from "./AuthLoader";

function ProtectedMain(props: InferProps<typeof Main>) {
	const sessionQueryResult = useQuery(sessionQuery());

	if (sessionQueryResult.data) {
		return <Main {...props} />;
	}

	return <AuthLoader />;
}

export { ProtectedMain };
