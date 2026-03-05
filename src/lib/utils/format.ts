export function formatPrice(price: number): string {
    return price.toLocaleString('es-AR');
}

export function formatPriceWithSymbol(price: number): string {
    return `$${formatPrice(price)}`;
}

export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
        return text;
    }
    return `${text.substring(0, maxLength)}...`;
}

