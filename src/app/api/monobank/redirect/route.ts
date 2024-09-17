import { NextResponse } from "next/server";
import { env } from "@/env.mjs";

export async function GET(req: Request) {
	return NextResponse.redirect(new URL(`${env.NEXT_PUBLIC_SITE_URL}/advertiser/billing`), 302);
}
