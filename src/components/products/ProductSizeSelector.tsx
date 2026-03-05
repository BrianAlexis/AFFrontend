'use client';

import { useState, useEffect } from 'react';

type PrecioVariante = {
    id: number;
    precio: number;
    tamano?: {
        id: number;
        documentId: string;
        nombre: string;
    };
};

type ProductSizeSelectorProps = {
    precioSolo: number | null;
    preciosVariables: PrecioVariante[];
    onPriceChange?: (price: number) => void;
};

export default function ProductSizeSelector({ precioSolo, preciosVariables, onPriceChange }: ProductSizeSelectorProps) {
    const tieneVariantes = preciosVariables && preciosVariables.length > 0;

    const obtenerNombresTamanos = (cantidad: number): string[] => {
        if (cantidad === 1) {
            return ['Único'];
        } else if (cantidad === 2) {
            return ['Mediano', 'Grande'];
        } else if (cantidad === 3) {
            return ['Chico', 'Mediano', 'Grande'];
        } else {
            return Array.from({ length: cantidad }, (_, i) => `Tamaño ${i + 1}`);
        }
    };

    const nombresDisponibles = obtenerNombresTamanos(preciosVariables.length);

    const [tamanoSeleccionado, setTamanoSeleccionado] = useState(0);

    const precioActual = tieneVariantes
        ? preciosVariables[tamanoSeleccionado]?.precio
        : precioSolo || 0;

    useEffect(() => {
        if (onPriceChange) {
            onPriceChange(precioActual);
        }
    }, [precioActual, onPriceChange]);

    return (
        <>
            <p className="text-color-primary text-xl md:text-2xl font-bold font-secondary z-10">
                ${precioActual?.toLocaleString('es-AR')}
            </p>

            {tieneVariantes && (
                <div className="flex flex-col gap-2">
                    <label className="text-color-secondary text-lg font-semibold font-secondary">
                        Tamaño:
                    </label>
                    <div className="flex gap-2 flex-wrap">
                        {preciosVariables.map((variante, index) => {
                            const nombreTamano = variante.tamano?.nombre || nombresDisponibles[index];

                            return (
                                <button
                                    key={variante.id}
                                    onClick={() => setTamanoSeleccionado(index)}
                                    className={`px-6 py-3 rounded-lg font-secondary font-semibold transition-all duration-200 ${tamanoSeleccionado === index
                                        ? 'bg-color-primary text-white shadow-lg scale-105'
                                        : 'bg-gray-200 text-color-secondary hover:bg-gray-300'
                                        }`}
                                >
                                    {nombreTamano}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </>
    );
}