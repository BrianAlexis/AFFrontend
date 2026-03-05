'use client';

import { useState } from 'react';

export interface CheckoutFormData {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
}

interface CheckoutFormProps {
    onSubmit: (data: CheckoutFormData) => void;
    onCancel: () => void;
    isProcessing: boolean;
}

export default function CheckoutForm({ onSubmit, onCancel, isProcessing }: CheckoutFormProps) {
    const [formData, setFormData] = useState<CheckoutFormData>({
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
    });

    const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof CheckoutFormData, string>> = {};

        if (!formData.email.trim()) {
            newErrors.email = 'El email es obligatorio';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Ingresa un email válido';
        }

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'El nombre es obligatorio';
        } else if (formData.firstName.trim().length < 2) {
            newErrors.firstName = 'El nombre debe tener al menos 2 caracteres';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'El apellido es obligatorio';
        } else if (formData.lastName.trim().length < 2) {
            newErrors.lastName = 'El apellido debe tener al menos 2 caracteres';
        }

        if (formData.phone && formData.phone.trim()) {
            const phoneRegex = /^\d{7,15}$/;
            if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
                newErrors.phone = 'Ingresa un teléfono válido (solo números)';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            onSubmit(formData);
        }
    };

    const handleChange = (field: keyof CheckoutFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    return (
        <div className="bg-white rounded-lg p-6">
            <h2 className="text-2xl font-bold text-color-secondary mb-4">
                Información de Contacto
            </h2>
            <p className="text-gray-600 mb-6">
                Completa tus datos para finalizar la compra
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-color-primary ${errors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="tu@email.com"
                        disabled={isProcessing}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleChange('firstName', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-color-primary ${errors.firstName ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="Juan"
                        disabled={isProcessing}
                    />
                    {errors.firstName && (
                        <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Apellido <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleChange('lastName', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-color-primary ${errors.lastName ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="Pérez"
                        disabled={isProcessing}
                    />
                    {errors.lastName && (
                        <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Teléfono <span className="text-gray-400">(opcional)</span>
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-color-primary ${errors.phone ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="1112345678"
                        disabled={isProcessing}
                    />
                    {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                        Solo números, sin espacios ni guiones
                    </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                        <strong>🔒 Seguro:</strong> Tus datos están protegidos y se utilizan solo para procesar tu pago.
                    </p>
                </div>

                <div className="flex gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isProcessing}
                        className="flex-1 py-3 px-4 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isProcessing}
                        className="flex-1 py-3 px-4 bg-color-primary text-white rounded-lg font-semibold hover:bg-color-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isProcessing ? 'Procesando...' : 'Continuar al Pago'}
                    </button>
                </div>
            </form>
        </div>
    );
}

