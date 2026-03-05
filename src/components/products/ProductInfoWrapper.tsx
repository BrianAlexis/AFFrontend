'use client';

import { useState, useEffect } from 'react';
import ProductPrice from './ProductPrice';
import SizeSelector from './SizeSelector';
import QuantitySelector from './QuantitySelector';
import type { PrecioVariante } from '@/src/types';

interface ProductInfoWrapperProps {
    precioSolo: number | null;
    preciosVariables: PrecioVariante[];
    descripcion: string;
    productId: number;
    productDocumentId: string;
    productTitle: string;
    productSlug: string;
    productImage: string | null;
    onCantidadPersonasChange?: (cantidadPersonas: string) => void;
}

export default function ProductInfoWrapper({
    precioSolo,
    preciosVariables,
    descripcion,
    productId,
    productDocumentId,
    productTitle,
    productSlug,
    productImage,
    onCantidadPersonasChange,
}: ProductInfoWrapperProps) {
    const tieneVariantes = preciosVariables && preciosVariables.length > 0;
    const precioInicial = tieneVariantes
        ? preciosVariables[0]?.precio
        : precioSolo || 0;

    const [precioActual, setPrecioActual] = useState(precioInicial);
    const [tamañoSeleccionado, setTamañoSeleccionado] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (tieneVariantes && preciosVariables[0]) {
            setPrecioActual(preciosVariables[0].precio);
            setTamañoSeleccionado(preciosVariables[0].tamano?.nombre);

            const primerVariante = preciosVariables[0];
            if (primerVariante.cantidadPersonasMin && primerVariante.cantidadPersonasMax && onCantidadPersonasChange) {
                const cantidadPersonas = `${primerVariante.cantidadPersonasMin} - ${primerVariante.cantidadPersonasMax}`;
                onCantidadPersonasChange(cantidadPersonas);
            }
        } else if (precioSolo) {
            setPrecioActual(precioSolo);
            setTamañoSeleccionado(undefined);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tieneVariantes, precioSolo]);

    const handleSizeChange = (index: number, nuevoPrecio: number) => {
        setPrecioActual(nuevoPrecio);
        setTamañoSeleccionado(preciosVariables[index]?.tamano?.nombre);

        const varianteSeleccionada = preciosVariables[index];
        if (varianteSeleccionada && onCantidadPersonasChange) {
            if (varianteSeleccionada.cantidadPersonasMin && varianteSeleccionada.cantidadPersonasMax) {
                const cantidadPersonas = `${varianteSeleccionada.cantidadPersonasMin} - ${varianteSeleccionada.cantidadPersonasMax}`;
                onCantidadPersonasChange(cantidadPersonas);
            }
        }
    };

    return (
        <>
            <ProductPrice precio={precioActual} />
            <p className="text-color-secondary text-xl font-secondary">{descripcion}</p>
            {tieneVariantes && (
                <SizeSelector
                    preciosVariables={preciosVariables}
                    onSizeChange={handleSizeChange}
                />
            )}
            <QuantitySelector
                productPrice={precioActual}
                productId={productId}
                productDocumentId={productDocumentId}
                productTitle={productTitle}
                productSlug={productSlug}
                productImage={productImage}
                tamaño={tamañoSeleccionado}
            />
        </>
    );
}

