import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { MP_ACCESS_TOKEN, PAYMENT_VERIFICATION_RETRY } from '@/src/lib/constants';

const client = new MercadoPagoConfig({
    accessToken: MP_ACCESS_TOKEN,
});

async function getPaymentWithRetry(
    paymentId: string,
    maxRetries = PAYMENT_VERIFICATION_RETRY.MAX_ATTEMPTS,
    delay = PAYMENT_VERIFICATION_RETRY.DELAY_MS
) {
    const payment = new Payment(client);

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const paymentInfo = await payment.get({ id: paymentId });
            return paymentInfo;
        } catch (error: unknown) {
            if (attempt === maxRetries) {
                throw error;
            }
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    throw new Error('No se pudo obtener el pago después de múltiples intentos');
}

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const paymentId = searchParams.get('payment_id');

        if (!paymentId) {
            return NextResponse.json(
                { error: 'No se proporcionó payment_id' },
                { status: 400 }
            );
        }

        if (!MP_ACCESS_TOKEN) {
            return NextResponse.json(
                { error: 'Credenciales no configuradas' },
                { status: 500 }
            );
        }

        const paymentInfo = await getPaymentWithRetry(paymentId);

        return NextResponse.json({
            id: paymentInfo.id,
            status: paymentInfo.status,
            status_detail: paymentInfo.status_detail,
            transaction_amount: paymentInfo.transaction_amount,
            date_created: paymentInfo.date_created,
            external_reference: paymentInfo.external_reference,
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const status = (error as { status?: number }).status;

        if (status === 404) {
            return NextResponse.json(
                {
                    error: 'Pago no encontrado',
                    details: errorMessage,
                    help: 'El pago puede no estar disponible aún. Intenta recargar la página en unos segundos.'
                },
                { status: 404 }
            );
        }

        console.error('Error verifying payment:', errorMessage);
        return NextResponse.json(
            { error: 'Error al verificar el pago', details: errorMessage },
            { status: 500 }
        );
    }
}
