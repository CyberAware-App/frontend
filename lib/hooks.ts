import { useRouter } from "@bprogress/next";
import { useEffect } from "react";
import { toast } from "sonner";

export const usePageBlocker = (options: { message: string; condition: boolean; redirectPath: string }) => {
	const { message, condition, redirectPath } = options;

	const router = useRouter();

	useEffect(() => {
		if (condition) {
			toast.error(message);

			router.push(redirectPath);
		}
	}, [router, condition, message, redirectPath]);
};
