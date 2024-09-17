
import { env } from '@/env.mjs';
import { TRPCError } from '@trpc/server';
import CloudIpsp, { type CheckoutFailureResponse, type CheckoutData, type CheckoutSuccessResponse } from 'cloudipsp-node-js-sdk';


export const fondy = new CloudIpsp({
    merchantId: parseInt(env.FONDY_MERCHANT_ID),
    secretKey: env.FONDY_TRANSACTION_KEY
})

export const requestPaymentURL = async (data: CheckoutData): Promise<CheckoutSuccessResponse> => {
    try {
        const response = await fondy.Checkout({
            ...data,
            response_url: `${env.NEXT_PUBLIC_SITE_URL}/api/fondy/redirect`,
            server_callback_url: `${env.NEXT_PUBLIC_SITE_URL}/api/fondy/deposit-callback`,
        });

        return response as CheckoutSuccessResponse;
    } catch (error) {
        const typedError = error as Partial<CheckoutFailureResponse> | null
        
        throw new TRPCError({ code: 'BAD_REQUEST', message: `Помилка платіжної системи. ${typedError?.response?.error_message}`})
    }
}

