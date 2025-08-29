"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardQuery, sessionQuery } from "@/lib/react-query/queryOptions";
import { LoadingScreen } from "../-components/LoadingScreen";

function ProtectedLayout({ children }: { children: React.ReactNode }) {
	const sessionQueryResult = useQuery(sessionQuery());

	useQuery(dashboardQuery());

	if (sessionQueryResult.data) {
		return children;
	}

	return <LoadingScreen />;
}

export default ProtectedLayout;
