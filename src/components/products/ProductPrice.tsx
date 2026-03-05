'use client';

import { formatPriceWithSymbol } from '@/src/lib/utils/format';

interface ProductPriceProps {
    precio: number;
}

export default function ProductPrice({ precio }: ProductPriceProps) {
    return (
        <p className="text-color-primary text-xl md:text-2xl font-bold font-secondary z-10">
            {formatPriceWithSymbol(precio)}
        </p>
    );
}

