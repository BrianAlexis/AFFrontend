'use client';

import { useState } from 'react';
import { useCartStore } from '@/src/store/cartStore';
import { toast } from 'sonner';

interface QuantitySelectorProps {
    productPrice: number;
    productId?: number;
    productDocumentId?: string;
    productTitle?: string;
    productSlug?: string;
    productImage?: string | null;
    tamaño?: string;
}

export default function QuantitySelector({
    productPrice,
    productId,
    productDocumentId,
    productTitle,
    productSlug,
    productImage,
    tamaño,
}: QuantitySelectorProps) {
    const [count, setCount] = useState(1);
    const addItem = useCartStore((state) => state.addItem);

    const incrementCount = () => setCount(prev => prev + 1);
    const decrementCount = () => setCount(prev => Math.max(1, prev - 1));

    const handleAddToCart = () => {
        if (!productId || !productDocumentId || !productTitle || !productSlug) return;

        addItem({
            productId,
            documentId: productDocumentId,
            titulo: productTitle,
            slug: productSlug,
            precio: productPrice,
            cantidad: count,
            tamaño,
            imagen: productImage || undefined,
        });

        setCount(1);
        toast.success('Producto agregado al carrito', {
            description: `${productTitle}${tamaño ? ` (${tamaño})` : ''} - Cantidad: ${count}`,
        });
    };

    const canAddToCart = productId && productDocumentId && productTitle && productSlug;

    return (
        <div className="flex flex-col gap-2 mt-4">
            <div className="flex items-center rounded-lg text-center gap-4">
                <div className="flex bg-background-card rounded-lg px-4 py-2.5 w-1/3 justify-between border border-color-secondary">
                    <button
                        onClick={decrementCount}
                        disabled={count <= 1}
                        aria-label="Disminuir cantidad"
                    >
                        -
                    </button>
                    <span className="text-color-secondary font-bold w-8 text-center">{count}</span>
                    <button
                        onClick={incrementCount}
                        aria-label="Aumentar cantidad"
                    >
                        +
                    </button>
                </div>
                <button
                    onClick={handleAddToCart}
                    disabled={!canAddToCart}
                    className="inline-flex items-center px-4 py-3 text-sm font-medium text-center text-white bg-color-primary hover:bg-color-primary-hover rounded-lg transition duration-300 gap-1.5 w-2/3 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Agregar producto al carrito"
                >
                    Agregar al carrito
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path d="M6 2a1 1 0 0 1 .993 .883l.007 .117v1.068l13.071 .935a1 1 0 0 1 .929 1.024l-.01 .114l-1 7a1 1 0 0 1 -.877 .853l-.113 .006h-12v2h10a3 3 0 1 1 -2.995 3.176l-.005 -.176l.005 -.176c.017 -.288 .074 -.564 .166 -.824h-5.342a3 3 0 1 1 -5.824 1.176l-.005 -.176l.005 -.176a3.002 3.002 0 0 1 1.995 -2.654v-12.17h-1a1 1 0 0 1 -.993 -.883l-.007 -.117a1 1 0 0 1 .883 -.993l.117 -.007h2zm0 16a1 1 0 1 0 0 2a1 1 0 0 0 0 -2zm11 0a1 1 0 1 0 0 2a1 1 0 0 0 0 -2z" />
                    </svg>
                </button>
            </div>
        </div>
    );
}