import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { NEXT_PUBLIC_STRAPI_HOST, NEXT_PUBLIC_BASE_URL, MP_ACCESS_TOKEN } from '@/src/lib/constants';

interface CartItem {
    productId: number;
    titulo: string;
    cantidad: number;
    precio: number;
    tamaño?: string;
    imagen?: string;
}

interface PayerData {
    email?: string;
    name?: string;
    surname?: string;
    phone?: string;
}

const client = new MercadoPagoConfig({
    accessToken: MP_ACCESS_TOKEN,
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { items, payer }: { items: CartItem[]; payer: PayerData } = body;

        if (!items || items.length === 0) {
            return NextResponse.json(
                { error: 'No se proporcionaron items para el pago' },
                { status: 400 }
            );
        }

        if (!MP_ACCESS_TOKEN) {
            return NextResponse.json(
                { error: 'Credenciales de Mercado Pago no configuradas' },
                { status: 500 }
            );
        }

        const preference = new Preference(client);
        const isLocalhost = NEXT_PUBLIC_BASE_URL.includes('localhost') || NEXT_PUBLIC_BASE_URL.includes('127.0.0.1');

        const backUrls = isLocalhost ? {
            success: 'https://www.tu-sitio.com/success',
            failure: 'https://www.tu-sitio.com/failure',
            pending: 'https://www.tu-sitio.com/pending',
        } : {
            success: `${NEXT_PUBLIC_BASE_URL}/checkout/success`,
            failure: `${NEXT_PUBLIC_BASE_URL}/checkout/failure`,
            pending: `${NEXT_PUBLIC_BASE_URL}/checkout/pending`,
        };

        const preferenceData: Record<string, unknown> = {
            items: items.map((item: CartItem) => {
                const itemData: Record<string, unknown> = {
                    id: String(item.productId),
                    title: item.titulo,
                    quantity: item.cantidad,
                    unit_price: Number(item.precio),
                    currency_id: 'ARS',
                };

                if (item.tamaño) {
                    itemData.description = `Tamaño: ${item.tamaño}`;
                }

                if (item.imagen) {
                    const imageUrl = item.imagen.startsWith('http')
                        ? item.imagen
                        : `${NEXT_PUBLIC_STRAPI_HOST}${item.imagen}`;
                    itemData.picture_url = imageUrl;
                }

                return itemData;
            }),
            back_urls: backUrls,
            statement_descriptor: 'Tu Tienda',
            external_reference: `ORDER-${Date.now()}`,
        };

        if (payer && Object.keys(payer).length > 0) {
            const payerData: Record<string, unknown> = {};

            if (payer.email) {
                payerData.email = payer.email;
            }

            if (payer.name || payer.surname) {
                payerData.name = payer.name || '';
                payerData.surname = payer.surname || '';
            }

            if (payer.phone) {
                const cleanPhone = payer.phone.replace(/\D/g, '');
                if (cleanPhone.length >= 7) {
                    payerData.phone = {
                        area_code: cleanPhone.substring(0, 2),
                        number: cleanPhone.substring(2)
                    };
                }
            }

            if (Object.keys(payerData).length > 0) {
                preferenceData.payer = payerData;
            }
        }

        if (!isLocalhost) {
            preferenceData.auto_return = 'approved';
        }

        const response = await preference.create({ body: preferenceData as never });

        return NextResponse.json({
            id: response.id,
            init_point: response.init_point,
            sandbox_init_point: response.sandbox_init_point,
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        console.error('Error creating payment preference:', errorMessage);

        return NextResponse.json(
            {
                error: 'Error al crear la preferencia de pago',
                details: errorMessage,
            },
            { status: 500 }
        );
    }
}
