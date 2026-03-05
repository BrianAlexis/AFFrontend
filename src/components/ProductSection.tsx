'use client';

import { useState } from 'react';
import type { Producto, Categoria } from '@/src/types';
import Link from 'next/link';
import Image from 'next/image';
import { NEXT_PUBLIC_STRAPI_HOST } from '@/src/lib/constants';

export default function ProductSection({ productsArray, categorias }: { productsArray: Producto[], categorias: string[] }) {
    const [activeCategory, setActiveCategory] = useState('Todos los productos');

    const filteredProducts = productsArray.filter((product: Producto) => {
        const productCategories = product.categorias;

        if (activeCategory === 'Todos los productos') {
            return true;
        }

        if (productCategories && Array.isArray(productCategories)) {
            return productCategories.some((cat: Categoria) => cat.nombre === activeCategory);
        }

        return false;
    });

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8 p-4 md:p-8 max-w-7xl mx-auto mt-12 justify-items-center">

            <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-400 h-fit md:text-center lg:sticky lg:top-24 z-10 max-w-[24rem]">
                <h2 className="text-xl font-bold mb-4 border-b pb-2 text-gray-800">
                    Categorías
                </h2>

                <div className="space-y-1">
                    {categorias.map((category: string, index: number) => (
                        <button
                            key={index}
                            onClick={() => setActiveCategory(category)}
                            className={`
                                w-full text-left py-2 px-4 rounded-lg transition duration-300 text-base cursor-pointer
                                ${category === activeCategory
                                    ? 'bg-text-primary text-white font-semibold shadow-md'
                                    : 'text-color-secondary  hover:bg-teal-100'
                                }
                            `}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 justify-center h-fit w-fit">

                {filteredProducts.map((product: Producto) => {
                    const {
                        id,
                        titulo,
                        descripcion,
                        cantidadpersonas,
                        imagen,
                        precioSolo,
                        Precio,
                        categorias,
                        slug,
                    } = product;

                    const imageUrl = imagen?.url ? `${NEXT_PUBLIC_STRAPI_HOST}${imagen.url}` : null;
                    const preciosArray = Precio?.map((p) => p.precio).filter(Boolean) || [];
                    const menorPrecio =
                        preciosArray.length > 0
                            ? Math.min(...preciosArray)
                            : null;

                    const precioFinal =
                        precioSolo !== null && precioSolo !== undefined
                            ? precioSolo
                            : menorPrecio;

                    return (
                        <div key={id} className="max-w-sm bg-background-card border border-gray-400 rounded-lg shadow-lg relative">

                            <div className="absolute top-2 left-2 z-10 flex flex-wrap gap-2">
                                {categorias && Array.isArray(categorias) && categorias.map((cat: Categoria) => (
                                    <div
                                        key={cat.id}
                                        className="bg-text-primary text-white text-xs font-semibold px-2 py-1 rounded-full"
                                    >
                                        {cat.nombre}
                                    </div>
                                ))}
                            </div>

                            <Link href={`/productos/${slug}`}>
                                {imageUrl ? (
                                    <div className="relative h-48 w-full rounded-t-lg overflow-hidden">
                                        <Image
                                            src={imageUrl}
                                            alt={titulo || 'Producto'}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-48 w-full bg-gray-200 rounded-t-lg">
                                        Sin Imagen
                                    </div>
                                )}
                            </Link>

                            <div className="p-5">
                                <Link href={`/productos/${slug}`}>
                                    <h5 className="text-color-secondary mb-2 text-xl font-bold tracking-tight">
                                        {titulo}
                                    </h5>
                                </Link>

                                <p className="text-color-secondary mb-4 text-sm">
                                    {descripcion && descripcion.length > 130
                                        ? `${descripcion.substring(0, 130)}...`
                                        : descripcion}
                                </p>

                                <p className="text-color-secondary text-sm font-bold flex gap-1 text-center items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                        className="icon icon-tabler icons-tabler-outline icon-tabler-users text-color-secondary">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
                                        <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                        <path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
                                    </svg>
                                    {cantidadpersonas}
                                </p>

                                <div className="flex justify-between items-center mt-4">
                                    <p className="text-color-primary text-2xl font-bold">
                                        {precioFinal
                                            ? `$${precioFinal.toLocaleString('es-AR')}`
                                            : 'Consultar'}
                                    </p>

                                    <Link href={`/productos/${slug}`}
                                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-color-primary hover:bg-color-primary-hover rounded-lg transition duration-300 gap-1.5">
                                        Comprar
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                            viewBox="0 0 24 24" fill="currentColor"
                                            className="icon icon-tabler icons-tabler-filled icon-tabler-shopping-cart">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <path d="M6 2a1 1 0 0 1 .993 .883l.007 .117v1.068l13.071 .935a1 1 0 0 1 .929 1.024l-.01 .114l-1 7a1 1 0 0 1 -.877 .853l-.113 .006h-12v2h10a3 3 0 1 1 -2.995 3.176l-.005 -.176l.005 -.176c.017 -.288 .074 -.564 .166 -.824h-5.342a3 3 0 1 1 -5.824 1.176l-.005 -.176l.005 -.176a3.002 3.002 0 0 1 1.995 -2.654v-12.17h-1a1 1 0 0 1 -.993 -.883l-.007 -.117a1 1 0 0 1 .883 -.993l.117 -.007h2zm0 16a1 1 0 1 0 0 2a1 1 0 0 0 0 -2zm11 0a1 1 0 1 0 0 2a1 1 0 0 0 0 -2z" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
