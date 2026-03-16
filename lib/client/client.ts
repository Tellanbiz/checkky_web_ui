import axios from "axios";

const apiBaseURL =
    process.env.INTERNAL_API_URL ||
    process.env.API_URL ||
    process.env.LOCAL_API_URL ||
    (process.env.NODE_ENV !== "production"
        ? "http://127.0.0.1:8000"
        : process.env.NEXT_PUBLIC_API_URL) ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://127.0.0.1:8000";

export const clientV1 = axios.create({
    baseURL: `${apiBaseURL}/api/v1`,
    withCredentials: true,
});

export function clientError(error: any): string {
    if (error.response) {
        return error.response.data?.error ?? "Validation or server error";
    } else if (error.request) {
        return "No response from server";
    }

    return "Unexpected error occurred";

}
