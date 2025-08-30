"use client";

import { useQuery } from "@tanstack/react-query";
import { usePageBlocker } from "@/lib/hooks";
import { sessionQuery } from "@/lib/react-query/queryOptions";
import { LoadingScreen } from "../-components/LoadingScreen";

function AuthLayout({ children }: { children: React.ReactNode }) {
	const sessionQueryResult = useQuery(sessionQuery());

	usePageBlocker({
		condition: Boolean(sessionQueryResult.data),
		message: "You cannot access this page while logged in!",
		redirectPath: "/dashboard",
	});

	if (sessionQueryResult.isPending) {
		return <LoadingScreen text="Just a moment..." />;
	}

	if (sessionQueryResult.data) {
		return null;
	}

	return children;
}

export default AuthLayout;
