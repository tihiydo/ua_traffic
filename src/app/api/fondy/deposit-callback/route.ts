import { db } from "@/server/db";
import { type ServerCallbackResponse } from "cloudipsp-node-js-sdk";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    const data = await req.json() as ServerCallbackResponse;

    const depositTransaction = await db.depositTransaction.findUnique({
        where: {
            id: data.merchant_data
        }
    })

    if (!depositTransaction) {
        return NextResponse.json({ status: 'error', message: 'Транзакцію не знайдено' }, { status: 404 })
    }

    if (depositTransaction.status !== 'Processing') {
        return NextResponse.json({ status: 'error', message: 'Транзакція завершена' }, { status: 204 })
    }

    
    await db.depositTransaction.update({
        where: {
            id: depositTransaction.id
        },
        data: {
            paymentSystemResponse: data
        }
    })

    if (data.order_status === 'approved') {
        await db.$transaction([
            db.depositTransaction.update({
                where: {
                    id: depositTransaction.id
                },
                data: {
                    status: 'Done',
                }
            }),
            db.user.update({
                where: {
                    id: depositTransaction.userId
                },
                data: {
                    advertiserBalance: {
                        increment: depositTransaction.realAmount
                    }
                }
            })
        ])

        return NextResponse.json({ status: 'error', message: 'Транзакція успішна' }, { status: 200 })
    }

    if (data.order_status === 'declined') {
        await db.depositTransaction.update({
            where: {
                id: depositTransaction.id
            },
            data: {
                status: 'Declined',
            }
        })

        return NextResponse.json({ status: 'error', message: 'Транзакція відхилена' }, { status: 200 })
    }

    if (data.order_status === 'expired') {
        await db.depositTransaction.update({
            where: {
                id: depositTransaction.id
            },
            data: {
                status: 'Expired',
            }
        })

        return NextResponse.json({ status: 'error', message: 'Час тразакції скінчився' }, { status: 200 })
    }

    return NextResponse.json({ status: 'error', message: 'Невідомий статус' }, { status: 200 })
}