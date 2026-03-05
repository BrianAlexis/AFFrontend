"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback } from "react";
import { useCartStore } from "@/src/store/cartStore";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { NEXT_PUBLIC_STRAPI_HOST } from "@/src/lib/constants";
import { getProductPrice, getProductDisplayPrice } from "@/src/lib/utils/product-price";
import type { Producto } from "@/src/types";

interface AdditionalProductsCarouselProps {
    productos: Producto[];
    categoriaNombre?: string;
}

export default function AdditionalProductsCarousel({
    productos,
    categoriaNombre,
}: AdditionalProductsCarouselProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel(
        { loop: true, align: "start", slidesToScroll: 1 },
        [Autoplay({ delay: 4000 })]
    );

    const addItem = useCartStore((state) => state.addItem);

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

    const handleAddToCart = (product: Producto) => {
        const precioFinal = getProductPrice(product);

        if (!precioFinal) {
            toast.error('Error al agregar producto', {
                description: 'El producto no tiene un precio definido',
            });
            return;
        }

        addItem({
            productId: product.id,
            documentId: product.documentId,
            titulo: product.titulo,
            slug: product.slug,
            precio: precioFinal,
            cantidad: 1,
            imagen: product.imagen?.url || undefined,
        });

        toast.success('Producto agregado al carrito', {
            description: product.titulo,
        });
    };

    return (
        <div className="relative">
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex gap-6">
                    {productos.map((product) => {
                        const { id, titulo, descripcion, cantidadpersonas, imagen, slug } = product;
                        const imageUrl = imagen?.url ? `${NEXT_PUBLIC_STRAPI_HOST}${imagen.url}` : null;
                        const truncatedDesc = descripcion && descripcion.length > 130
                            ? `${descripcion.substring(0, 130)}...`
                            : descripcion;

                        return (
                            <div
                                key={id}
                                className="min-w-[300px] max-w-[300px] shrink-0 bg-background-card border border-gray-400 rounded-lg shadow-lg relative"
                            >
                                {categoriaNombre && (
                                    <div className="absolute top-2 left-2 bg-color-primary text-white text-xs font-semibold px-2 py-1 rounded-full z-10">
                                        {categoriaNombre}
                                    </div>
                                )}

                                <Link href={`/productos/${slug}`}>
                                    {imageUrl ? (
                                        <div className="relative h-48 w-full rounded-t-lg overflow-hidden">
                                            <Image
                                                src={imageUrl}
                                                alt={titulo}
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
                                    <h5 className="text-color-secondary mb-2 text-xl font-bold tracking-tight">
                                        {titulo}
                                    </h5>

                                    <p className="text-color-secondary mb-4 text-sm">
                                        {truncatedDesc}
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
                                            {getProductDisplayPrice(product)}
                                        </p>

                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            className="inline-flex items-center px-4 py-3 text-sm font-medium text-center text-white bg-color-primary hover:bg-color-primary-hover rounded-lg transition duration-300 gap-1.5"
                                            aria-label={`Agregar ${titulo} al carrito`}
                                        >
                                            Agregar al carrito
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M0 0h24v24H0z" fill="none" />
                                                <path d="M6 2a1 1 0 0 1 .993 .883l.007 .117v1.068l13.071 .935a1 1 0 0 1 .929 1.024l-.01 .114l-1 7a1 1 0 0 1 -.877 .853l-.113 .006h-12v2h10a3 3 0 1 1 -2.995 3.176l-.005 -.176l.005 -.176c.017 -.288 .074 -.564 .166 -.824h-5.342a3 3 0 1 1 -5.824 1.176l-.005 -.176l.005 -.176a3.002 3.002 0 0 1 1.995 -2.654v-12.17h-1a1 1 0 0 1 -.993 -.883l-.007 -.117a1 1 0 0 1 .883 -.993l.117 -.007h2zm0 16a1 1 0 1 0 0 2a1 1 0 0 0 0 -2zm11 0a1 1 0 1 0 0 2a1 1 0 0 0 0 -2z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <button
                onClick={scrollPrev}
                className="absolute left-0 xl:-left-18 top-1/2 -translate-y-1/1 bg-color-primary text-white rounded-full shadow hover:bg-color-primary-hover transition duration-300 py-2 px-4 md:py-3 md:px-6 text-4xl"
                aria-label="Anterior"
            >
                <span className="relative -top-1.5">‹</span>
            </button>
            <button
                onClick={scrollNext}
                className="absolute right-0 xl:-right-18 top-1/2 -translate-y-1/1 bg-color-primary text-white rounded-full shadow hover:bg-color-primary-hover transition duration-300 py-2 px-4 md:py-3 md:px-6 text-4xl"
                aria-label="Siguiente"
            >
                <span className="relative -top-1.5">›</span>
            </button>
        </div>
    );
}
