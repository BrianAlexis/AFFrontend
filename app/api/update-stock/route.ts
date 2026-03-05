import { NextRequest, NextResponse } from 'next/server';
import { STRAPI_HOST, STRAPI_API_TOKEN } from '@/src/lib/constants';

interface StockUpdateItem {
    documentId: string;
    cantidad: number;
}

interface StockUpdateRequest {
    items: StockUpdateItem[];
    paymentId: string;
}

async function getCurrentStock(documentId: string): Promise<number | null> {
    try {
        const response = await fetch(
            `${STRAPI_HOST}/api/products/${documentId}?fields[0]=stock`,
            {
                headers: {
                    'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
                },
            }
        );

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        return data.data?.stock ?? null;
    } catch (error) {
        console.error(`Error getting stock for ${documentId}:`, error);
        return null;
    }
}

async function updateProductStock(
    documentId: string,
    cantidadAReducir: number
): Promise<{ success: boolean; message: string; currentStock?: number }> {
    try {
        const currentStock = await getCurrentStock(documentId);

        if (currentStock === null) {
            return {
                success: false,
                message: `No se pudo obtener el stock actual del producto ${documentId}`,
            };
        }

        if (currentStock < cantidadAReducir) {
            return {
                success: false,
                message: `Stock insuficiente. Disponible: ${currentStock}, solicitado: ${cantidadAReducir}`,
                currentStock,
            };
        }

        const newStock = currentStock - cantidadAReducir;

        const updateResponse = await fetch(
            `${STRAPI_HOST}/api/products/${documentId}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
                },
                body: JSON.stringify({
                    data: { stock: newStock },
                }),
            }
        );

        if (!updateResponse.ok) {
            return {
                success: false,
                message: `Error al actualizar stock en Strapi`,
            };
        }

        return {
            success: true,
            message: `Stock actualizado: ${currentStock} → ${newStock}`,
            currentStock: newStock,
        };
    } catch (error) {
        console.error(`Error updating stock for ${documentId}:`, error);
        return {
            success: false,
            message: 'Error interno al actualizar stock',
        };
    }
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const itemsParam = searchParams.get('items');

    if (!itemsParam) {
        return NextResponse.json(
            { error: 'Parámetro items es requerido' },
            { status: 400 }
        );
    }

    try {
        const items: StockUpdateItem[] = JSON.parse(itemsParam);
        const results = [];
        let allAvailable = true;

        for (const item of items) {
            const currentStock = await getCurrentStock(item.documentId);
            const disponible = currentStock !== null && currentStock >= item.cantidad;

            results.push({
                documentId: item.documentId,
                cantidadSolicitada: item.cantidad,
                stockDisponible: currentStock,
                disponible,
            });

            if (!disponible) {
                allAvailable = false;
            }
        }

        return NextResponse.json({ available: allAvailable, items: results });
    } catch (error) {
        console.error('Error checking stock:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor al verificar stock' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    if (!STRAPI_API_TOKEN) {
        return NextResponse.json(
            { error: 'Credenciales de Strapi no configuradas' },
            { status: 500 }
        );
    }

    try {
        const body: StockUpdateRequest = await request.json();
        const { items, paymentId } = body;

        if (!items || items.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'No se proporcionaron items para actualizar stock',
                },
                { status: 400 }
            );
        }

        const updateResults = [];
        let allUpdatesSuccessful = true;

        for (const item of items) {
            const result = await updateProductStock(item.documentId, item.cantidad);
            updateResults.push({
                documentId: item.documentId,
                cantidad: item.cantidad,
                ...result,
            });

            if (!result.success) {
                allUpdatesSuccessful = false;
            }
        }

        console.log(`Stock update completed for payment ${paymentId}:`, {
            successful: updateResults.filter(r => r.success).length,
            failed: updateResults.filter(r => !r.success).length,
        });

        if (allUpdatesSuccessful) {
            return NextResponse.json({
                success: true,
                message: 'Stock actualizado correctamente',
                results: updateResults,
            });
        } else {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Algunos productos no pudieron actualizarse',
                    results: updateResults,
                },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('Error in POST /api/update-stock:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Error interno del servidor al actualizar stock',
            },
            { status: 500 }
        );
    }
}
