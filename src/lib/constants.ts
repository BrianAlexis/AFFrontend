export const STRAPI_HOST = process.env.STRAPI_HOST || 'http://localhost:1338';
export const STRAPI_API_TOKEN = process.env.STRAPI_TOKEN || '';
export const NEXT_PUBLIC_STRAPI_HOST = process.env.NEXT_PUBLIC_STRAPI_HOST || 'http://localhost:1338';
export const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || '';

export const CART_STORAGE_KEY = 'cart-storage';

export const TOAST_DURATION = {
    SHORT: 2000,
    MEDIUM: 3000,
    LONG: 5000,
} as const;

export const SIZE_NAMES = {
    ONE: ['Único'],
    TWO: ['Mediano', 'Grande'],
    THREE: ['Chico', 'Mediano', 'Grande'],
} as const;

export const PAYMENT_STATUS = {
    APPROVED: 'approved',
    PENDING: 'pending',
    IN_PROCESS: 'in_process',
    REJECTED: 'rejected',
    CANCELLED: 'cancelled',
} as const;

export const ADICIONALES_CATEGORY_SLUG = 'adicionales';

export const PAYMENT_VERIFICATION_RETRY = {
    MAX_ATTEMPTS: 3,
    DELAY_MS: 2000,
} as const;

