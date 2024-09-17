import type { Prisma, WithdrawTransaction } from "@prisma/client"

type AdRequestTransaction = Prisma.AdRequestTransactionGetPayload<{
    include: {
        Request: {
            include: {
                AdvertismentPost: true
            }
        }
    }
}>

type TransferTransaction = Prisma.TransferTransactionGetPayload<{}>

export type BloggerHistoryItem = (WithdrawTransaction & {
    type: (typeof BloggerTransactionType)['Withdraw']
}) | (AdRequestTransaction & {
    type: (typeof BloggerTransactionType)['Request']
}) | (TransferTransaction & {
    type: (typeof BloggerTransactionType)['Transfer']
})


export type BloggerTransactionType = ObjectValues<typeof BloggerTransactionType>;
export const BloggerTransactionType = {
    Withdraw: 'Withdraw',
    Request: 'Request',
    Transfer: 'Transfer'
} as const