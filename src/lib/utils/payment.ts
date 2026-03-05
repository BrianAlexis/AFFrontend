import { CartItem } from '@/src/store/cartStore';
import { NEXT_PUBLIC_STRAPI_HOST } from '@/src/lib/constants';

export interface PayerInfo {
    email: string;
    name: string;
    surname: string;
    phone?: string;
}

export interface PaymentPreference {
    items: CartItem[];
    payer: PayerInfo;
}

export async function createPaymentPreference(data: PaymentPreference): Promise<{
    id: string;
    init_point: string;
    sandbox_init_point: string;
}> {
    const response = await fetch('/api/create-preference', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Error creating payment preference');
    }

    return await response.json();
}

export async function verifyPayment(paymentId: string): Promise<{
    id: string;
    status: string;
    status_detail: string;
    transaction_amount: number;
    date_created: string;
    external_reference: string;
}> {
    const response = await fetch(`/api/verify-payment?payment_id=${paymentId}`);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error verifying payment');
    }

    return await response.json();
}

export function getProductImageUrl(imagePath: string | undefined): string | undefined {
    if (!imagePath) return undefined;
    return `${NEXT_PUBLIC_STRAPI_HOST}${imagePath}`;
}

