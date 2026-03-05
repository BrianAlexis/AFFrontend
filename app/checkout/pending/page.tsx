'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import NavBar from '@/src/components/NavBar';
import ConfettiBackground from '@/src/components/ConfettiBackground';

function CheckoutPendingContent() {
    const searchParams = useSearchParams();
    const paymentId = searchParams.get('payment_id');
    const externalReference = searchParams.get('external_reference');

    return (
        <>
            <NavBar />
            <main className="bg-background min-h-screen w-full flex items-center justify-center p-4 relative">
                <ConfettiBackground />

                <div className="max-w-2xl w-full bg-background-card rounded-2xl shadow-xl p-8 md:p-12 text-center z-10 relative">
                    <div className="mb-6">
                        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-10 w-10 text-yellow-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-color-secondary mb-3 font-primary">
                            Pago Pendiente
                        </h1>
                        <p className="text-lg text-gray-600 mb-6">
                            Tu pago está siendo procesado
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6 mb-8">
                        <p className="text-gray-700 mb-4">
                            Tu pago está pendiente de confirmación. Te notificaremos cuando se complete.
                        </p>
                        <div className="text-left space-y-3">
                            {paymentId && (
                                <div className="flex justify-between py-2 border-b border-gray-200">
                                    <span className="text-gray-600">ID de Pago:</span>
                                    <span className="font-semibold text-color-secondary">{paymentId}</span>
                                </div>
                            )}
                            {externalReference && (
                                <div className="flex justify-between py-2">
                                    <span className="text-gray-600">Referencia:</span>
                                    <span className="font-semibold text-color-secondary">{externalReference}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-blue-800">
                            <strong>Nota:</strong> Este estado es común en pagos con transferencia bancaria,
                            efectivo u otros medios que requieren confirmación manual.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <Link
                            href="/"
                            className="block w-full py-3 px-6 bg-color-primary text-white rounded-lg font-semibold hover:bg-color-primary-hover transition-colors"
                        >
                            Volver al Inicio
                        </Link>
                        <Link
                            href="/#products"
                            className="block w-full py-3 px-6 border-2 border-color-primary text-color-primary rounded-lg font-semibold hover:bg-color-primary-hover hover:text-color-tertiary transition-colors"
                        >
                            Seguir Comprando
                        </Link>
                    </div>

                    <p className="text-sm text-gray-500 mt-6">
                        Recibirás un correo electrónico cuando tu pago sea confirmado
                    </p>
                </div>
            </main>
        </>
    );
}

export default function CheckoutPending() {
    return (
        <Suspense fallback={
            <>
                <NavBar />
                <main className="bg-background min-h-screen w-full flex items-center justify-center p-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-color-primary" />
                </main>
            </>
        }>
            <CheckoutPendingContent />
        </Suspense>
    );
}

