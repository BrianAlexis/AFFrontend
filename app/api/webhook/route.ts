import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { MP_ACCESS_TOKEN, PAYMENT_STATUS } from '@/src/lib/constants';

const client = new MercadoPagoConfig({
    accessToken: MP_ACCESS_TOKEN,
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { type, data } = body;

        if (type !== 'payment') {
            return NextResponse.json({
                success: true,
                message: 'Notificación recibida'
            }, { status: 200 });
        }

        const paymentId = data.id;
        const payment = new Payment(client);
        const paymentInfo = await payment.get({ id: paymentId });

        console.log('Payment notification received:', {
            id: paymentInfo.id,
            status: paymentInfo.status,
            external_reference: paymentInfo.external_reference,
        });

        switch (paymentInfo.status) {
            case PAYMENT_STATUS.APPROVED:
                break;
            case PAYMENT_STATUS.PENDING:
            case PAYMENT_STATUS.IN_PROCESS:
                break;
            case PAYMENT_STATUS.REJECTED:
            case PAYMENT_STATUS.CANCELLED:
                break;
        }

        return NextResponse.json({
            success: true,
            message: 'Webhook procesado correctamente'
        }, { status: 200 });

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error processing webhook:', errorMessage);

        return NextResponse.json(
            {
                success: false,
                error: 'Error interno procesando webhook',
            },
            { status: 200 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        status: 'ok',
        message: 'Webhook endpoint está activo'
    });
}
