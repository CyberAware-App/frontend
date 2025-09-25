import { useEffect } from "react";
import { useRouter } from "@bprogress/next";
import { toast } from "sonner";

export const usePageBlocker = (options: { condition: boolean; message: string; redirectPath: string }) => {
	const { condition, message, redirectPath } = options;

	const router = useRouter();

	useEffect(() => {
		if (!condition) return;

		const timeout = setTimeout(() => {
			toast.error(message);

			router.push(redirectPath);
		}, 100);

		return () => clearTimeout(timeout);
	}, [router, condition, message, redirectPath]);
};
