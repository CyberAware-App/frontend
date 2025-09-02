import type { UnknownObject } from "@zayne-labs/toolkit-type-helpers";
import { redirect } from "next/navigation";
import { checkUserSession } from "@/lib/api/callBackendApi/plugins/utils/session";

function withProtectionServer(WrappedComponent: React.ComponentType, pathname: AppRoutes) {
	return async function AuthComponent(props: UnknownObject) {
		const { error } = await checkUserSession();

		if (error) {
			redirect(pathname);
		}

		return <WrappedComponent {...props} />;
	};
}

export { withProtectionServer };
