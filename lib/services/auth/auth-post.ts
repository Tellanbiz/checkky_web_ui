"use server";

import { clientV1 } from "@/lib/client/client";
import { redirect, RedirectType } from "next/navigation";
import { cookies } from "next/headers";
import { AuthResult, SignUpParams, SignUpVerificationParams } from "./models";


export async function signInWithEmail(formData: FormData) {
    const res = await clientV1.post("/auth/email/signin", {
        value: formData.get("email"),
        password: formData.get("password"),
    });

    if (res.status === 200) {
        const r: AuthResult = res.data as AuthResult;
        const cookieStore = await cookies();
        cookieStore.set("access_token", r.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
        });

        redirect(`/dashboard`, RedirectType.push);
    } else {
        redirect(`/?error=unable to authenticate`, RedirectType.replace);
    }
}


export async function signUpWithEmail(params: SignUpParams) {
    const res = await clientV1.post("/auth/email/signup", params);

    if (res.status === 200) {
        redirect(`/auth/signup/complete`, RedirectType.push);
    } else {
        redirect(`/?error=unable to authenticate`, RedirectType.replace);
    }
}

export async function completeSignUpWithEmail(params: SignUpVerificationParams) {
    const res = await clientV1.post("/auth/email/complete", params);
    if (res.status === 200) {
        const r: AuthResult = res.data as AuthResult;
        const cookieStore = await cookies();
        cookieStore.set("access_token", r.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
        });

        redirect(`/dashboard`, RedirectType.push);
    } else {
        redirect(`/?error=unable to authenticate`, RedirectType.replace);
    }
}
