const REMOTE_BACKEND_HOST = "https://hon-agnella-cyberaware-ecca99d6.koyeb.app";

export const BACKEND_HOST =
	process.env.NODE_ENV === "development" ? "http://127.0.0.1:8000" : REMOTE_BACKEND_HOST;

// export const BACKEND_HOST = REMOTE_BACKEND_HOST;

export const BASE_API_URL = `${BACKEND_HOST}/api`;
