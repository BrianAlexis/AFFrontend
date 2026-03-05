'use client';

import { useState } from 'react';
import ProductInfoWrapper from './ProductInfoWrapper';
import type { PrecioVariante } from '@/src/types';

interface ProductContentProps {
    titulo: string;
    cantidadpersonas: string;
    precioSolo: number | null;
    preciosVariables: PrecioVariante[];
    descripcion: string;
    productId: number;
    productDocumentId: string;
    productSlug: string;
    productImage: string | null;
}

export default function ProductContent({
    titulo,
    cantidadpersonas,
    precioSolo,
    preciosVariables,
    descripcion,
    productId,
    productDocumentId,
    productSlug,
    productImage,
}: ProductContentProps) {
    const [cantidadPersonasActual, setCantidadPersonasActual] = useState(cantidadpersonas);

    const handleCantidadPersonasChange = (nuevaCantidadPersonas: string) => {
        setCantidadPersonasActual(nuevaCantidadPersonas);
    };

    return (
        <div className="flex flex-col gap-3 lg:place-content-between z-10">
            <h1 className="text-color-secondary text-4xl md:text-5xl font-primary font-bold pt-4 lg:pt-0 pb-2 z-10">
                {titulo}
            </h1>

            <p className="text-color-secondary text-xl font-bold flex gap-1 text-center items-center opacity-80 z-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-users text-color-secondary">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
                    <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    <path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
                </svg>
                {cantidadPersonasActual}
            </p>

            <ProductInfoWrapper
                precioSolo={precioSolo}
                preciosVariables={preciosVariables}
                descripcion={descripcion}
                productId={productId}
                productDocumentId={productDocumentId}
                productTitle={titulo}
                productSlug={productSlug}
                productImage={productImage}
                onCantidadPersonasChange={handleCantidadPersonasChange}
            />
        </div>
    );
}

