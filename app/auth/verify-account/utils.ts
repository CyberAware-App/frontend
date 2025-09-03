import { callBackendApi } from "@/lib/api/callBackendApi";

export const resendOtp = (email: string) => {
	void callBackendApi("@post/resend-otp", {
		body: { email },
		meta: { auth: { skipHeaderAddition: true } },
	});
};
