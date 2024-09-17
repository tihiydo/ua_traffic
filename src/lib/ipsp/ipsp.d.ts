declare module "cloudipsp-node-js-sdk" {
    export type CloudIpspOptions = {
        merchantId: number;
        secretKey: string;
    }

    export default class CloudIpsp {
        constructor(options: CloudIpspOptions);

        Checkout(data: CheckoutData): Promise<any>
    }

    export const CloudIpsp: CloudIpspConstructor;

    export type CheckoutData = {
        order_id: string,
        order_desc: string,
        currency: 'UAH' | 'USD',
        amount: string,
        response_url?: string;
        server_callback_url?: string
        merchant_data: string;
    }

    export type CheckoutSuccessResponse = {
        checkout_url: string;
        payment_id: string;
        response_status: 'success';
    }

    export type CheckoutFailureResponse = {
        response: {
            response_status: 'failure';
            error_message: string;
            request_id: string;
            error_code: number
        }
    }


    export type ServerCallbackResponse = {
        order_status: 'created' | 'processing' | 'declined' | 'approved' | 'expired' | 'reversed';
        amount: number;
        currency: 'UAH' | 'USD';
        merchant_data: string;
    }
}