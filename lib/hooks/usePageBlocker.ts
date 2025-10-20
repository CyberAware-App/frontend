import { useRouter } from "@bprogress/next";
import { useEffect } from "react";
import { toast } from "sonner";

type Options = {
	condition: boolean;
	message: string;
	redirectPath: string;
};

export const usePageBlocker = (options: Options) => {
	const { condition, message, redirectPath } = options;

	const router = useRouter();

	useEffect(() => {
		if (!condition) return;

		const timeout = setTimeout(() => {
			toast.error(message);

			router.replace(redirectPath);
		}, 300);

		return () => clearTimeout(timeout);
	}, [router, condition, message, redirectPath]);
};
