"use client";

import { useQuery } from "@tanstack/react-query";
import { sessionQuery } from "@/lib/react-query/queryOptions";
import { AuthLoader } from "./-components/AuthLoader";

function ProtectedLayout({ children }: { children: React.ReactNode }) {
	const sessionQueryResult = useQuery(sessionQuery());

	if (sessionQueryResult.data) {
		return children;
	}

	return <AuthLoader />;
}

export default ProtectedLayout;
