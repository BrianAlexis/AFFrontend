'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '@/src/store/cartStore';
import NavBar from '@/src/components/NavBar';
import ConfettiBackground from '@/src/components/ConfettiBackground';
import { toast } from 'sonner';
import { verifyPayment } from '@/src/lib/utils/payment';
import { prepareStockCheckItems, updateStock } from '@/src/lib/utils/stock';
import { PAYMENT_STATUS } from '@/src/lib/constants';

interface PaymentInfo {
    id: string;
    status: string;
    status_detail: string;
    transaction_amount: number;
    date_created: string;
    external_reference: string;
}

function CheckoutSuccessContent() {
    const searchParams = useSearchParams();
    const clearCart = useCartStore((state) => state.clearCart);
    const items = useCartStore((state) => state.items);

    const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
    const [isVerifying, setIsVerifying] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [stockUpdateStatus, setStockUpdateStatus] = useState<'idle' | 'updating' | 'success' | 'failure'>('idle');

    const paymentId = searchParams.get('payment_id');

    useEffect(() => {
        const handlePaymentVerification = async () => {
            if (!paymentId) {
                setIsVerifying(false);
                setError('No se pudo verificar el pago');
                toast.error('Error', {
                    description: 'No se encontró un ID de pago para verificar.',
                });
                return;
            }

            try {
                const data = await verifyPayment(paymentId);
                setPaymentInfo(data);

                if (data.status === PAYMENT_STATUS.APPROVED) {
                    toast.success('¡Pago Aprobado!', {
                        description: 'Tu compra ha sido procesada. Actualizando stock...',
                    });
                    setStockUpdateStatus('updating');

                    try {
                        const stockItems = prepareStockCheckItems(items);
                        const stockResult = await updateStock(stockItems, paymentId);

                        if (stockResult.success) {
                            setStockUpdateStatus('success');
                            clearCart();
                            toast.success('Stock Actualizado', {
                                description: 'El stock de tus productos ha sido ajustado.',
                            });
                        } else {
                            setStockUpdateStatus('failure');
                            clearCart();
                            toast.error('Error al Actualizar Stock', {
                                description: 'Por favor, contacta al soporte.',
                                duration: 5000,
                            });
                        }
                    } catch {
                        setStockUpdateStatus('failure');
                        clearCart();
                        toast.error('Error al Actualizar Stock', {
                            description: 'Por favor, contacta al soporte.',
                            duration: 5000,
                        });
                    }
                } else if (data.status === PAYMENT_STATUS.PENDING || data.status === PAYMENT_STATUS.IN_PROCESS) {
                    toast.info('Pago Pendiente', {
                        description: 'Tu pago está siendo procesado. Te notificaremos cuando se complete.',
                    });
                }
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Error al verificar el pago';
                setError(errorMessage);
                toast.error('Error de Verificación', {
                    description: errorMessage,
                    duration: 5000,
                });
            } finally {
                setIsVerifying(false);
            }
        };

        handlePaymentVerification();
    }, [paymentId, items, clearCart]);

    const renderContent = () => {
        if (isVerifying) {
            return (
                <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-color-primary mb-4"></div>
                    <h1 className="text-2xl font-bold text-color-secondary mb-2">Verificando tu pago...</h1>
                    <p className="text-gray-600">Esto puede tardar unos segundos.</p>
                </div>
            );
        }

        if (error || !paymentInfo) {
            return (
                <div className="mb-6">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-color-secondary mb-3 font-primary">
                        Error de Verificación
                    </h1>
                    <p className="text-lg text-gray-600 mb-6">
                        {error || 'No se pudo verificar el estado del pago'}
                    </p>
                    <div className="space-y-3">
                        <button
                            onClick={() => window.location.reload()}
                            className="block w-full py-3 px-6 bg-color-primary text-white rounded-lg font-semibold hover:bg-color-primary-hover transition-colors"
                        >
                            Reintentar Verificación
                        </button>
                        <Link
                            href="/"
                            className="block w-full py-3 px-6 border-2 border-color-primary text-color-primary rounded-lg font-semibold hover:bg-color-primary-hover transition-colors text-center"
                        >
                            Volver al Inicio
                        </Link>
                    </div>
                </div>
            );
        }

        switch (paymentInfo.status) {
            case PAYMENT_STATUS.APPROVED:
                return (
                    <>
                        <ConfettiBackground />
                        <div className="mb-6">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-color-secondary mb-3 font-primary">
                                ¡Pago Exitoso!
                            </h1>
                            <p className="text-lg text-gray-600 mb-6">
                                Tu compra ha sido procesada correctamente
                            </p>
                        </div>
                        {stockUpdateStatus === 'updating' && (
                            <div className="flex flex-col items-center justify-center mb-4">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-color-primary mb-2"></div>
                                <p className="text-gray-600">Actualizando stock...</p>
                            </div>
                        )}
                        {stockUpdateStatus === 'failure' && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                                <strong className="font-bold">Error de Stock:</strong>
                                <span className="block sm:inline"> Hubo un problema al actualizar el stock. Por favor, contacta al soporte.</span>
                            </div>
                        )}
                        <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
                            <h2 className="text-xl font-semibold text-color-secondary mb-4">
                                Detalles de la transacción
                            </h2>
                            <div className="flex justify-between py-2 border-b border-gray-200">
                                <span className="text-gray-600">ID de Pago:</span>
                                <span className="font-semibold text-color-secondary">{paymentInfo.id}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-200">
                                <span className="text-gray-600">Estado:</span>
                                <span className="font-semibold text-green-600 capitalize">{paymentInfo.status}</span>
                            </div>
                            {paymentInfo.external_reference && (
                                <div className="flex justify-between py-2">
                                    <span className="text-gray-600">Referencia:</span>
                                    <span className="font-semibold text-color-secondary">{paymentInfo.external_reference}</span>
                                </div>
                            )}
                        </div>
                        <div className="space-y-3">
                            <Link
                                href="/"
                                className="block w-full py-3 px-6 bg-color-primary text-white rounded-lg font-semibold hover:bg-color-primary-hover transition-colors text-center"
                            >
                                Volver al Inicio
                            </Link>
                            <Link
                                href="/#products"
                                className="block w-full py-3 px-6 border-2 border-color-primary text-color-primary rounded-lg font-semibold hover:bg-cyan-50-50 transition-colors text-center"
                            >
                                Seguir Comprando
                            </Link>
                        </div>
                        <p className="text-sm text-gray-500 mt-6">
                            Recibirás un correo electrónico con los detalles de tu compra
                        </p>
                    </>
                );
            case PAYMENT_STATUS.PENDING:
            case PAYMENT_STATUS.IN_PROCESS:
                return (
                    <>
                        <div className="mb-6">
                            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                        </div>
                        <div className="space-y-3">
                            <Link
                                href="/"
                                className="block w-full py-3 px-6 bg-color-primary text-white rounded-lg font-semibold hover:bg-color-primary-hover transition-colors text-center"
                            >
                                Volver al Inicio
                            </Link>
                        </div>
                    </>
                );
            default:
                return (
                    <>
                        <div className="mb-6">
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-color-secondary mb-3 font-primary">
                                Pago Rechazado
                            </h1>
                            <p className="text-lg text-gray-600 mb-6">
                                No pudimos procesar tu pago
                            </p>
                        </div>
                        <div className="space-y-3">
                            <button
                                onClick={() => window.location.reload()}
                                className="block w-full py-3 px-6 bg-color-primary text-white rounded-lg font-semibold hover:bg-color-primary-hover transition-colors"
                            >
                                Reintentar Verificación
                            </button>
                            <Link
                                href="/"
                                className="block w-full py-3 px-6 border-2 border-color-primary text-color-primary rounded-lg font-semibold hover:bg-cyan-50 transition-colors text-center"
                            >
                                Volver al Inicio
                            </Link>
                        </div>
                    </>
                );
        }
    };

    return (
        <>
            <NavBar />
            <main className="bg-background min-h-screen w-full flex items-center justify-center p-4 relative">
                <div className="max-w-2xl w-full bg-background-card rounded-2xl shadow-xl p-8 md:p-12 text-center z-10 relative">
                    {renderContent()}
                </div>
            </main>
        </>
    );
}

export default function CheckoutSuccess() {
    return (
        <Suspense fallback={
            <>
                <NavBar />
                <main className="bg-background min-h-screen w-full flex items-center justify-center p-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-color-primary" />
                </main>
            </>
        }>
            <CheckoutSuccessContent />
        </Suspense>
    );
}
