"use server";

import { clientV1 } from "@/lib/client/client";
import { clientError } from "@/lib/client/client";
import { redirect, RedirectType } from "next/navigation";
import { cookies } from "next/headers";
import { AuthResult } from "@/lib/services/auth/models";
import {
    RequestEmailChangeParams,
    UpdateProfileParams,
    VerifyEmailChangeParams,
} from "./models";

export async function updateProfile(params: UpdateProfileParams) {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
        throw new Error("Not authenticated");
    }

    const res = await clientV1.put("/account/profile", params, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (res.status !== 200) {
        throw new Error("Failed to update profile");
    }

    return res.data;
}

export async function requestEmailChange(params: RequestEmailChangeParams) {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
        throw new Error("Not authenticated");
    }

    try {
        const res = await clientV1.post("/account/email-change/request", params, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return res.data;
    } catch (error) {
        throw new Error(clientError(error));
    }
}

export async function verifyEmailChange(params: VerifyEmailChangeParams) {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
        throw new Error("Not authenticated");
    }

    try {
        const res = await clientV1.post("/account/email-change/verify", params, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return res.data;
    } catch (error) {
        throw new Error(clientError(error));
    }
}

export async function updateCurrentFarm(formData: FormData) {
    const res = await clientV1.post("/account/farm", {
        "farm_id": formData.get("name"),
    });

    if (res.status === 200) {
        const r: AuthResult = res.data as AuthResult;
        const cookieStore = await cookies();
        cookieStore.set({
            name: "access_token",
            value: r.access_token,
            httpOnly: true,
            path: "/",
        });

        redirect(`/dashboard`, RedirectType.push);
    } else {
        redirect(`/?error=unable to authenticate`, RedirectType.replace);
    }
}


export async function submitFarm(formData: FormData) {
    const res = await clientV1.post("/farms", {
        "name": formData.get("name"),
        "location": formData.get("location"),
        "country": formData.get("country"),
        "size_ha": Number(formData.get("size_ha")),
        "points": [Number(formData.get("latitude")), Number(formData.get("longitude")),]
    });

    if (res.status === 200) {
        const r: AuthResult = res.data as AuthResult;
        const cookieStore = await cookies();
        cookieStore.set({
            name: "access_token",
            value: r.access_token,
            httpOnly: true,
            path: "/",
        });

        redirect(`/dashboard`, RedirectType.push);
    } else {
        redirect(`/?error=unable to authenticate`, RedirectType.replace);
    }
}
