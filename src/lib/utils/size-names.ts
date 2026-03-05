export function getSizeNames(count: number): string[] {
    if (count === 1) return ['Único'];
    if (count === 2) return ['Mediano', 'Grande'];
    if (count === 3) return ['Chico', 'Mediano', 'Grande'];
    return Array.from({ length: count }, (_, i) => `Tamaño ${i + 1}`);
}

