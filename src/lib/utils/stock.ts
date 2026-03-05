import { CartItem } from '@/src/store/cartStore';

export interface StockCheckItem {
    documentId: string;
    cantidad: number;
    titulo?: string;
}

export interface StockCheckResult {
    available: boolean;
    items: Array<{
        documentId: string;
        titulo?: string;
        cantidadSolicitada: number;
        stockDisponible: number;
        disponible: boolean;
    }>;
}

export function prepareStockCheckItems(items: CartItem[]): StockCheckItem[] {
    return items.map(item => ({
        documentId: item.documentId,
        cantidad: item.cantidad,
        titulo: item.titulo,
    }));
}

export async function checkStock(items: StockCheckItem[]): Promise<StockCheckResult> {
    const response = await fetch(
        `/api/update-stock?items=${encodeURIComponent(JSON.stringify(items))}`
    );

    if (!response.ok) {
        throw new Error('Error checking stock availability');
    }

    return await response.json();
}

export async function updateStock(items: StockCheckItem[], paymentId: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch('/api/update-stock', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items, paymentId }),
    });

    if (!response.ok) {
        throw new Error('Error updating stock');
    }

    return await response.json();
}

