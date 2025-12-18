import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const incomingFormData = await req.formData();

    const forwardFormData = new FormData();
    for (const [key, value] of incomingFormData.entries()) {
        forwardFormData.append(key, value);
    }

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiBaseUrl) {
        return NextResponse.json(
            { error: "Missing NEXT_PUBLIC_API_URL" },
            { status: 500 }
        );
    }

    const upstream = await fetch(`${apiBaseUrl}/api/v1/checklist/upload`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: forwardFormData,
    });

    const contentType = upstream.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
        const data = await upstream.json();
        return NextResponse.json(data, { status: upstream.status });
    }

    const text = await upstream.text();
    return new NextResponse(text, {
        status: upstream.status,
        headers: {
            "content-type": contentType || "text/plain",
        },
    });
}
