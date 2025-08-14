"use server";

import { clientV1 } from "@/lib/client/client";
import { redirect, RedirectType } from "next/navigation";
import { cookies } from "next/headers";
import { AuthResult } from "@/lib/services/auth/models";






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
