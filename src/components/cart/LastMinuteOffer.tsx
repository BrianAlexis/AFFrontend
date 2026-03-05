'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { useCartStore } from '@/src/store/cartStore';
import { NEXT_PUBLIC_STRAPI_HOST } from '@/src/lib/constants';
import { getProductPrice } from '@/src/lib/utils/product-price';
import { formatPriceWithSymbol } from '@/src/lib/utils/format';
import type { Producto } from '@/src/types';

export default function LastMinuteOffer() {
    const [producto, setProducto] = useState<Producto | null>(null);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const addItem = useCartStore((state) => state.addItem);
    const items = useCartStore((state) => state.items);

    useEffect(() => {
        const fetchProductoAdicional = async () => {
            try {
                const query = "filters[slug][$eq]=adicionales&populate[productos][populate][imagen][fields][0]=id&populate[productos][populate][imagen][fields][1]=url&populate[productos][fields][0]=id&populate[productos][fields][1]=documentId&populate[productos][fields][2]=titulo&populate[productos][fields][3]=descripcion&populate[productos][fields][4]=slug&populate[productos][fields][5]=precioSolo&populate[productos][fields][6]=cantidadpersonas&populate[productos][populate][Precio][fields][0]=precio";
                const response = await fetch(`${NEXT_PUBLIC_STRAPI_HOST}/api/categorias?${query}`);
                const data = await response.json();

                if (data.data?.[0]?.productos?.length > 0) {
                    const productos = data.data[0].productos;
                    const productosNoEnCarrito = productos.filter(
                        (p: Producto) => !items.some(item => item.productId === p.id)
                    );

                    if (productosNoEnCarrito.length > 0) {
                        const randomIndex = Math.floor(Math.random() * productosNoEnCarrito.length);
                        setProducto(productosNoEnCarrito[randomIndex]);
                    }
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProductoAdicional();
    }, [items]);

    const handleAddToCart = async () => {
        if (!producto) return;

        setAdding(true);

        try {
            const precioFinal = getProductPrice(producto);

            if (!precioFinal) {
                toast.error('Error', {
                    description: 'El producto no tiene un precio definido',
                });
                return;
            }

            addItem({
                productId: producto.id,
                documentId: producto.documentId,
                titulo: producto.titulo,
                slug: producto.slug,
                precio: precioFinal,
                cantidad: 1,
                imagen: producto.imagen?.url || undefined,
            });

            toast.success('¡Agregado!', {
                description: `${producto.titulo} añadido al carrito`,
            });

            setProducto(null);
            setLoading(true);
        } catch {
            toast.error('Error', {
                description: 'No se pudo agregar el producto',
            });
        } finally {
            setAdding(false);
        }
    };

    if (loading || !producto) {
        return null;
    }

    const precioFinal = getProductPrice(producto);

    return (
        <div className="border-t border-gray-200 pt-4 pb-4">
            <div className="bg-linear-to-r from-cyan-50 to-amber-50 rounded-lg p-4 border-2 border-cyan-200">
                <div className="flex items-center gap-2 mb-6">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-color-primary"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                        ¡Aprovechá esta última oferta!
                    </h3>
                </div>

                <div className="flex gap-3 items-center">
                    {producto.imagen?.url && (
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-white">
                            <Image
                                src={`${NEXT_PUBLIC_STRAPI_HOST}${producto.imagen.url}`}
                                alt={producto.titulo}
                                fill
                                className="object-cover"
                                sizes="80px"
                            />
                        </div>
                    )}

                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-color-secondary text-sm mb-1 truncate">
                            {producto.titulo}
                        </h4>
                        <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                            {producto.descripcion}
                        </p>
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-lg font-bold text-color-primary">
                                {precioFinal && formatPriceWithSymbol(precioFinal)}
                            </span>
                            <button
                                onClick={handleAddToCart}
                                disabled={adding}
                                className="bg-color-primary text-white px-4 py-2 rounded-lg hover:bg-color-primary-hover transition-colors text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
                                aria-label={`Agregar ${producto.titulo} al carrito`}
                            >
                                {adding ? 'Agregando...' : '+ Agregar'}
                            </button>
                        </div>
                    </div>
                </div>

                <p className="text-xs text-gray-500 mt-3 text-center italic">
                    💡 Agregalo ahora y aprovechá la oferta
                </p>
            </div>
        </div>
    );
}

