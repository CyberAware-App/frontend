import { callBackendApi } from "@/lib/api/callBackendApi";

export const resendOtp = async (email: string) => {
	await callBackendApi("/resend-otp", {
		body: { email },
		method: "POST",
	});
};
