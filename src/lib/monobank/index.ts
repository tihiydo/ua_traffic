import axios from 'axios';
import { TRPCError } from '@trpc/server';
import { env } from '@/env.mjs';

interface MonobankPaymentResponse {
    invoiceId: string;
    pageUrl: string;
}

interface MonobankPaymentData {
    amount: number;
}

export const requestMonobankPaymentURL = async (data: MonobankPaymentData): Promise<MonobankPaymentResponse> => {
    try {
        const response = await axios.post<MonobankPaymentResponse>('https://api.monobank.ua/api/merchant/invoice/create', {
            amount: data.amount,
            ccy: 980,
            redirectUrl: `${env.NEXT_PUBLIC_SITE_URL}/api/monobank/redirect`,
            webhookUrl: `${env.NEXT_PUBLIC_SITE_URL}/api/monobank/callback`,
        }, {
            headers: {
                'X-Token': env.MONOBANK_TEST_TOKEN,
            }
        });

        return response.data
    } catch (error : any)  
    {
        console.error('Monobank API error:', error.response?.data || error.message || error);
        const message = error.response?.data?.errorMessage || 'Unknown error';
        throw new TRPCError({ code: 'BAD_REQUEST', message: `Payment system error: ${message}` });
    }
};
