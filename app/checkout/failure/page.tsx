'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import NavBar from '@/src/components/NavBar';
import ConfettiBackground from '@/src/components/ConfettiBackground';

function CheckoutFailureContent() {
    const searchParams = useSearchParams();
    const paymentId = searchParams.get('payment_id');

    return (
        <>
            <NavBar />
            <main className="bg-background min-h-screen w-full flex items-center justify-center p-4 relative">
                <ConfettiBackground />

                <div className="max-w-2xl w-full bg-background-card rounded-2xl shadow-xl p-8 md:p-12 text-center z-10 relative">
                    <div className="mb-6">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-10 w-10 text-red-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-color-secondary mb-3 font-primary">
                            Pago Rechazado
                        </h1>
                        <p className="text-lg text-gray-600 mb-6">
                            No pudimos procesar tu pago
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6 mb-8">
                        <p className="text-gray-700 mb-4">
                            El pago no pudo ser procesado. Esto puede deberse a:
                        </p>
                        <ul className="text-left text-gray-600 space-y-2 mb-4">
                            <li className="flex items-start">
                                <span className="text-color-primary mr-2">•</span>
                                Fondos insuficientes
                            </li>
                            <li className="flex items-start">
                                <span className="text-color-primary mr-2">•</span>
                                Datos de la tarjeta incorrectos
                            </li>
                            <li className="flex items-start">
                                <span className="text-color-primary mr-2">•</span>
                                Límite de compra excedido
                            </li>
                            <li className="flex items-start">
                                <span className="text-color-primary mr-2">•</span>
                                Problemas con el banco emisor
                            </li>
                        </ul>
                        {paymentId && (
                            <p className="text-sm text-gray-500 mt-4">
                                ID de referencia: {paymentId}
                            </p>
                        )}
                    </div>

                    <div className="space-y-3">
                        <Link
                            href="/"
                            className="block w-full py-3 px-6 bg-color-primary text-white rounded-lg font-semibold hover:bg-color-primary-hover transition-colors"
                        >
                            Intentar Nuevamente
                        </Link>
                        <Link
                            href="/#products"
                            className="block w-full py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                        >
                            Volver a la Tienda
                        </Link>
                    </div>

                    <p className="text-sm text-gray-500 mt-6">
                        Si el problema persiste, contacta a tu banco o prueba con otro medio de pago
                    </p>
                </div>
            </main>
        </>
    );
}

function CheckoutFailureFallback() {
    return (
        <>
            <NavBar />
            <main className="bg-background min-h-screen w-full flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-color-primary" />
            </main>
        </>
    );
}

export default function CheckoutFailure() {
    return (
        <Suspense fallback={<CheckoutFailureFallback />}>
            <CheckoutFailureContent />
        </Suspense>
    );
}

