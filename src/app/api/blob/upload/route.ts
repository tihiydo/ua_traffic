import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
    const body = (await request.json()) as HandleUploadBody;
    const { searchParams } = new URL(request.url);
    const allowed = (searchParams.get('allowed')?.split(",")) || ["image/jpeg"] //Error: Vercel Blob: Access denied, please provide a valid token for this resource. ЦЯ ПОМИЛКА ПРИ НЕВІРНОМУ ТИПІ 

    try {
        const upload = await handleUpload({
            body, request,
            onBeforeGenerateToken: async () => {
                return {
                    allowedContentTypes: allowed,
                    tokenPayload: JSON.stringify({}),
                };
            },
            onUploadCompleted: async ({ blob }) => {
                //
            },
        });

        return NextResponse.json(upload);
    }
    catch (error) {
        return NextResponse.json({ status: false, message: (error as Error).message })
    }
}