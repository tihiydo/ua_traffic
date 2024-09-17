import type { DepositTransaction, Prisma } from "@prisma/client"

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
export type AdvertiserHistoryItem = (DepositTransaction & {
    type: (typeof AdvertiserTransactionType)['Deposit']
}) | (AdRequestTransaction & {
    type: (typeof AdvertiserTransactionType)['Request']
}) | (TransferTransaction & {
    type: (typeof AdvertiserTransactionType)['Transfer']
})


export type AdvertiserTransactionType = ObjectValues<typeof AdvertiserTransactionType>;
export const AdvertiserTransactionType = {
    Deposit: 'Deposit',
    Request: 'Request',
    Transfer: 'Transfer',
} as const