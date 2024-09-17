import { db } from "@/server/db";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

interface MonobankCallbackData {
    invoiceId: string;
    status: "created" | "processing" | "hold"|  "success" | "failure" | "reversed" | "expired";
    amount: number;
    paymentInfo?:
    {
        fee: number
    }
}


export async function POST(req: Request) {
    const response = await req.json()
    console.log(response)
    const data = response as MonobankCallbackData;

    const depositTransaction = await db.depositTransaction.findFirst({
        where: {
            invoiceId: data.invoiceId
        }
    });

    if (depositTransaction == null) 
    {
        console.log("We can't find transaction")
        return NextResponse.json({ status: 'error', message: 'Транзакцію не знайдено' }, { status: 200 });
    }
    
    if (depositTransaction.status !== 'Processing') 
    {
        console.log("Transcation not in process")
        return NextResponse.json({ status: 'error', message: 'Транзакція не в процессі' }, { status: 200 });
    }

    await db.depositTransaction.update({
        where: {
            id: depositTransaction.id
        },
        data: {
            paymentSystemResponse: response as Prisma.JsonArray
        }
    });

    if (data.status == "success") 
    {
        await db.$transaction
        ([
            db.depositTransaction.update({
                where: {
                    id: depositTransaction.id
                },
                data: {
                    status: 'Done',
                    realAmount: data.paymentInfo?.fee ? parseFloat((depositTransaction.realAmount - (data.paymentInfo.fee / 100)).toFixed(2)) : depositTransaction.realAmount
                }
            }),
            db.user.update({
                where: {
                    id: depositTransaction.userId
                },
                data: {
                    advertiserBalance: {
                        increment: data.paymentInfo?.fee ? parseFloat((depositTransaction.realAmount - (data.paymentInfo.fee / 100)).toFixed(2)) : depositTransaction.realAmount
                    }
                }
            })
        ]);

        return NextResponse.json({ status: 'success', message: 'Транзакція успішна' }, { status: 200 });
    }

    if (data.status === "failure") 
    {
        await db.depositTransaction.update({
            where: {
                id: depositTransaction.id
            },
            data: {
                status: 'Declined',
            }
        });

        return NextResponse.json({ status: 'error', message: 'Транзакція відхилена' }, { status: 200 });
    }

    if (data.status === 'expired') 
    {
        await db.depositTransaction.update({
            where: {
                id: depositTransaction.id
            },
            data: {
                status: 'Expired',
            }
        });

        return NextResponse.json({ status: 'error', message: 'Час тразакції скінчився' }, { status: 200 });
    }

    return NextResponse.json({ status: 'error', message: 'Невідомий статус' }, { status: 200 });
}
