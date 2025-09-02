"use client";

import { useQuery } from "@tanstack/react-query";
import { usePageBlocker } from "@/lib/hooks";
import { sessionQuery } from "@/lib/react-query/queryOptions";

function AuthTemplate({ children }: { children: React.ReactNode }) {
	const sessionQueryResult = useQuery(sessionQuery());

	usePageBlocker({
		condition: Boolean(sessionQueryResult.data),
		message: "You're already logged in! Redirecting to dashboard...",
		redirectPath: "/dashboard",
	});

	return children;
}

export default AuthTemplate;
