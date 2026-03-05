'use client';

import { useEffect, useRef, useState } from 'react';
import { useCartStore } from '@/src/store/cartStore';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import CheckoutForm, { CheckoutFormData } from '@/src/components/checkout/CheckoutForm';
import LastMinuteOffer from '@/src/components/cart/LastMinuteOffer';
import { NEXT_PUBLIC_STRAPI_HOST } from '@/src/lib/constants';
import { checkStock, prepareStockCheckItems } from '@/src/lib/utils/stock';
import { createPaymentPreference } from '@/src/lib/utils/payment';
import { formatPriceWithSymbol } from '@/src/lib/utils/format';

export default function CartModal() {
    const { items, isOpen, closeCart, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();
    const drawerRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showCheckoutForm, setShowCheckoutForm] = useState(false);

    const handleRemoveItem = (itemId: string, itemTitle: string) => {
        removeItem(itemId);
        toast.info('Producto eliminado del carrito', {
            description: `${itemTitle}`,
        });
    };

    const handleUpdateQuantity = (itemId: string, newQuantity: number, itemTitle: string) => {
        if (newQuantity === 0) {
            handleRemoveItem(itemId, itemTitle);
        } else {
            updateQuantity(itemId, newQuantity);
            toast.success('Cantidad actualizada', {
                description: `${itemTitle} - Cantidad: ${newQuantity}`,
            });
        }
    };

    const handleClearCart = () => {
        clearCart();
        toast.info('Carrito vaciado', {
            description: 'Todos los productos han sido eliminados del carrito',
        });
    };

    const handleInitiateCheckout = () => {
        if (items.length === 0) {
            toast.error('El carrito está vacío');
            return;
        }
        setShowCheckoutForm(true);
    };

    const handleCheckoutFormSubmit = async (formData: CheckoutFormData) => {
        setIsProcessing(true);

        try {
            const stockItems = prepareStockCheckItems(items);
            const stockData = await checkStock(stockItems);

            if (!stockData.available) {
                const productosSinStock = stockData.items
                    .filter(item => !item.disponible)
                    .map(item => {
                        const producto = items.find(i => i.documentId === item.documentId);
                        return `${producto?.titulo} (disponible: ${item.stockDisponible}, solicitado: ${item.cantidadSolicitada})`;
                    })
                    .join(', ');

                toast.error('Stock insuficiente', {
                    description: `No hay suficiente stock para: ${productosSinStock}`,
                });
                setIsProcessing(false);
                return;
            }

            const data = await createPaymentPreference({
                items,
                payer: {
                    email: formData.email,
                    name: formData.firstName,
                    surname: formData.lastName,
                    phone: formData.phone,
                },
            });

            const checkoutUrl = data.sandbox_init_point || data.init_point;

            if (checkoutUrl) {
                toast.success('Redirigiendo al checkout...');
                window.location.href = checkoutUrl;
            } else {
                throw new Error('No se recibió la URL de checkout');
            }
        } catch {
            toast.error('Error al procesar el pago', {
                description: 'Por favor, inténtalo de nuevo',
            });
            setIsProcessing(false);
        }
    };

    const handleCancelCheckoutForm = () => {
        setShowCheckoutForm(false);
    };

    useEffect(() => {
        let mountTimer: NodeJS.Timeout;
        let animationTimer: NodeJS.Timeout;

        if (isOpen) {
            mountTimer = setTimeout(() => {
                setMounted(true);
                animationTimer = setTimeout(() => {
                    if (drawerRef.current) {
                        drawerRef.current.classList.remove('translate-x-full', 'opacity-0');
                        drawerRef.current.classList.add('translate-x-0', 'opacity-100');
                    }
                }, 10);
            }, 0);
        } else {
            if (drawerRef.current) {
                drawerRef.current.classList.remove('translate-x-0', 'opacity-100');
                drawerRef.current.classList.add('translate-x-full', 'opacity-0');
            }
            mountTimer = setTimeout(() => setMounted(false), 500);
        }

        return () => {
            if (mountTimer) clearTimeout(mountTimer);
            if (animationTimer) clearTimeout(animationTimer);
        };
    }, [isOpen]);

    if (!mounted && !isOpen) return null;

    const total = getTotalPrice();

    return (
        <>
            <div
                ref={drawerRef}
                className="fixed right-0 top-0 h-full w-1/5 min-w-[350px] bg-background-card shadow-2xl z-50 transform transition-all duration-500 ease-out translate-x-full opacity-0 rounded-l-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <h2 className="text-2xl font-bold text-color-secondary">
                            Carrito de Compras
                        </h2>
                        <button
                            onClick={closeCart}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                            aria-label="Cerrar carrito"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        {showCheckoutForm ? (
                            <CheckoutForm
                                onSubmit={handleCheckoutFormSubmit}
                                onCancel={handleCancelCheckoutForm}
                                isProcessing={isProcessing}
                            />
                        ) : items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="64"
                                    height="64"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1"
                                    className="text-gray-400 mb-4"
                                >
                                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" />
                                </svg>
                                <p className="text-gray-500 text-lg">Tu carrito está vacío</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex gap-4 p-4 border border-gray-400 rounded-lg"
                                    >
                                        {item.imagen && (
                                            <Link href={`/productos/${item.slug}`} onClick={closeCart}>
                                                <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                                                    <Image
                                                        src={`${NEXT_PUBLIC_STRAPI_HOST}${item.imagen}`}
                                                        alt={item.titulo}
                                                        fill
                                                        className="object-cover"
                                                        sizes="80px"
                                                    />
                                                </div>
                                            </Link>
                                        )}

                                        <div className="flex-1 min-w-0">
                                            <Link href={`/productos/${item.slug}`} onClick={closeCart}>
                                                <h3 className="font-semibold text-color-secondary truncate">
                                                    {item.titulo}
                                                </h3>
                                            </Link>
                                            {item.tamaño && (
                                                <p className="text-sm text-gray-500">Tamaño: {item.tamaño}</p>
                                            )}
                                            <p className="text-color-primary font-bold mt-1">
                                                {formatPriceWithSymbol(item.precio)}
                                            </p>

                                            <div className="flex items-center gap-2 mt-2">
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.id, item.cantidad - 1, item.titulo)}
                                                    className="cursor-pointer hover:bg-color-secondary hover:text-color-tertiary w-8 h-8 flex items-center justify-center border border-gray-300 rounded transition-colors"
                                                    aria-label="Reducir cantidad"
                                                >
                                                    -
                                                </button>
                                                <span className="w-8 text-center font-medium text-color-secondary">
                                                    {item.cantidad}
                                                </span>
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.id, item.cantidad + 1, item.titulo)}
                                                    className="cursor-pointer hover:bg-color-secondary hover:text-color-tertiary w-8 h-8 flex items-center justify-center border border-gray-300 rounded transition-colors"
                                                    aria-label="Aumentar cantidad"
                                                >
                                                    +
                                                </button>
                                                <button
                                                    onClick={() => handleRemoveItem(item.id, item.titulo)}
                                                    className="ml-auto text-red-500 hover:text-red-700 transition-colors"
                                                    aria-label="Eliminar producto"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="20"
                                                        height="20"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {items.length > 0 && !showCheckoutForm && (
                        <div className="border-t border-gray-200 p-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold text-color-secondary">
                                    Total:
                                </span>
                                <span className="text-2xl font-bold text-color-primary">
                                    {formatPriceWithSymbol(total)}
                                </span>
                            </div>

                            <LastMinuteOffer />

                            <button
                                onClick={handleClearCart}
                                className="cursor-pointer w-full py-2 px-4 text-red-600 border border-red-600 hover:text-color-tertiary hover:bg-red-600 rounded-lg hover:bg-red-50 transition-colors"
                            >
                                Vaciar Carrito
                            </button>
                            <button
                                onClick={handleInitiateCheckout}
                                disabled={isProcessing}
                                className="cursor-pointer w-full py-3 px-4 text-center text-white bg-color-primary rounded-lg hover:bg-color-primary-hover transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                Finalizar Compra
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

