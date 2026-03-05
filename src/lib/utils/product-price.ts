import type { Producto } from '@/src/types';

export function getProductPrice(product: Producto): number | null {
    const firstPrice = product.Precio?.[0]?.precio ?? null;
    return firstPrice !== null ? firstPrice : product.precioSolo;
}

export function getProductDisplayPrice(product: Producto): string {
    const price = getProductPrice(product);
    return price ? `$${price.toLocaleString('es-AR')}` : 'Consultar';
}

