import { type ServerCallbackResponse } from "cloudipsp-node-js-sdk";
import { NextResponse } from "next/server";
import { env } from "process";

function parseUrlEncoded(urlEncoded: string) {
    const obj: Record<string, any> = {};
    urlEncoded.split('&').forEach((element) => {
        const pair = element.split('=');

        obj[pair[0]!] = decodeURIComponent(pair[1] || '');
    });
    return obj;
}

export async function POST(req: Request) {
    // const textData = await req.text();
    // const decodedFormData = decodeURIComponent(textData);
    // const parsedData = parseUrlEncoded(decodedFormData) as ServerCallbackResponse

    return NextResponse.redirect(new URL(`${env.NEXT_PUBLIC_SITE_URL}/advertiser/billing`), 302);
}