'use client';

import { useState, useEffect } from 'react';
import type { PrecioVariante } from '@/src/types';
import { getSizeNames } from '@/src/lib/utils/size-names';

interface SizeSelectorProps {
    preciosVariables: PrecioVariante[];
    onSizeChange?: (index: number, precio: number) => void;
}

export default function SizeSelector({ preciosVariables, onSizeChange }: SizeSelectorProps) {
    const nombresDisponibles = getSizeNames(preciosVariables.length);
    const [tamanoSeleccionado, setTamanoSeleccionado] = useState(0);

    useEffect(() => {
        if (onSizeChange && preciosVariables[tamanoSeleccionado]) {
            onSizeChange(tamanoSeleccionado, preciosVariables[tamanoSeleccionado].precio);
        }
    }, [tamanoSeleccionado, preciosVariables, onSizeChange]);

    if (preciosVariables.length === 0) {
        return null;
    }

    return (
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
                                ? 'bg-color-primary text-white shadow-lg'
                                : 'bg-background-card text-text-primary hover:bg-color-contact-hover hover:text-white'
                                }`}
                        >
                            {nombreTamano}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

