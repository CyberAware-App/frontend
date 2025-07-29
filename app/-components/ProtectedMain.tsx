import type { InferProps } from "@zayne-labs/toolkit-react/utils";
// import { sessionQuery } from "@/lib/api/queryOptions";
import { cnMerge } from "@/lib/utils/cn";

// import { getQueryClient } from "./Providers";

function ProtectedMain(props: InferProps<"main">) {
	const { children, className, ...restOfProps } = props;

	// const queryClient = getQueryClient();

	// const sessionQueryResult = queryClient.getQueryData(sessionQuery().queryKey);

	return (
		<main
			id="main"
			className={cnMerge("relative flex w-full max-w-[430px] grow flex-col", className)}
			{...restOfProps}
		>
			{children}
		</main>
	);
}

export { ProtectedMain };
