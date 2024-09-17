import { del } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) 
{  
    try
    {
        const { searchParams } = new URL(request.url);
        const urlToDel = searchParams.get('url');

        if(urlToDel)
        {
            await del(urlToDel);
            return NextResponse.json({status: true})
        }
        return NextResponse.json({status: false, message: "Can't find your blob file"})
    }
    catch(error)
    {
        return NextResponse.json({status: false, message: (error as Error).message})
    }
}