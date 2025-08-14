import axios from "axios";

export const clientV1 = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v1`,
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