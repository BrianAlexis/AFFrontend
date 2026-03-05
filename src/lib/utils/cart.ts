import type { CartItem } from '@/src/types';

export function generateCartItemId(productId: number, tamaño?: string): string {
    return `${productId}-${tamaño || 'default'}-${Date.now()}`;
}

export function findExistingCartItem(
    items: CartItem[],
    productId: number,
    tamaño?: string,
    precio?: number
): CartItem | undefined {
    return items.find(
        (item) =>
            item.productId === productId &&
            item.tamaño === tamaño &&
            item.precio === precio
    );
}

export function calculateCartTotal(items: CartItem[]): number {
    return items.reduce((total, item) => total + item.precio * item.cantidad, 0);
}

export function calculateTotalItems(items: CartItem[]): number {
    return items.reduce((total, item) => total + item.cantidad, 0);
}

