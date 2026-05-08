import type { UnknownObject } from "@zayne-labs/toolkit-type-helpers";
import { redirect } from "next/navigation";
import type { MainAppRoutes } from "@/components/common/NavLink";
import { checkUserSession } from "@/lib/api/callBackendApi/plugins/utils/session";

function withProtectionServer(WrappedComponent: React.ComponentType, pathname: MainAppRoutes) {
	return async function AuthComponent(props: UnknownObject) {
		const { error } = await checkUserSession();

		if (error) {
			return redirect(pathname);
		}

		return <WrappedComponent {...props} />;
	};
}

export { withProtectionServer };
