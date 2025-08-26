"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardQuery, sessionQuery } from "@/lib/react-query/queryOptions";
import { AuthLoader } from "./-components/AuthLoader";

function ProtectedLayout({ children }: { children: React.ReactNode }) {
	const sessionQueryResult = useQuery(sessionQuery());
	useQuery(dashboardQuery());

	if (sessionQueryResult.data) {
		return children;
	}

	return <AuthLoader />;
}

export default ProtectedLayout;
