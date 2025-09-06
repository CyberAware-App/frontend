"use client";

import { useQuery } from "@tanstack/react-query";
import type { UnknownObject } from "@zayne-labs/toolkit-type-helpers";
import { LoadingScreen } from "@/app/-components/LoadingScreen";
import { sessionQuery } from "@/lib/react-query/queryOptions";

// eslint-disable-next-line ts-eslint/no-explicit-any
function withProtection(WrappedComponent: React.ComponentType<any>) {
	return function ProtectedComponent(props: UnknownObject) {
		const sessionQueryResult = useQuery(sessionQuery());

		if (sessionQueryResult.data) {
			return <WrappedComponent {...props} />;
		}

		return <LoadingScreen />;
	};
}

export { withProtection };
