import { NextResponse } from "next/server";

export function success ()
{
    return NextResponse.json({ message: "success" }, 
        {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
}

export function error (err : unknown)
{
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error", description: err }, 
        {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
}