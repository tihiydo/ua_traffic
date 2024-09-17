declare module "monobank-node-js-sdk" {
	export type MonobankOptions = {
		apiToken: string;
	};

	export default class Monobank {
		constructor(options: MonobankOptions);

		createInvoice(data: MonobankPaymentData): Promise<MonobankPaymentResponse>;
	}

	export type MonobankPaymentData = {
		order_id: string;
		order_desc: string;
		amount: string;
		currency: string;
		redirectUrl?: string;
		webhookUrl?: string;
	};

	export type MonobankPaymentResponse = {
		invoiceId: string;
		status: string;
		pageUrl: string;
	};

	export type MonobankCallbackResponse = {
		invoiceId: string;
		status: 'created' | 'processing' | 'declined' | 'approved' | 'expired' | 'reversed';
		amount: number;
		currency: string;
		merchantData: string;
	};
}
