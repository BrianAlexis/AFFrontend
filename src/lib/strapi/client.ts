import { STRAPI_HOST, STRAPI_API_TOKEN } from './config';

interface FetchOptions extends RequestInit {
    requiresAuth?: boolean;
}

export async function fetchStrapi<T = unknown>(
    endpoint: string,
    options: FetchOptions = {}
): Promise<T | null> {
    const { requiresAuth = false, ...fetchOptions } = options;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(fetchOptions.headers as Record<string, string>),
    };

    if (requiresAuth && STRAPI_API_TOKEN) {
        headers['Authorization'] = `Bearer ${STRAPI_API_TOKEN}`;
    }

    try {
        const url = endpoint.startsWith('http') ? endpoint : `${STRAPI_HOST}${endpoint}`;
        const response = await fetch(url, {
            ...fetchOptions,
            headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return (data.data || data) as T;
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Strapi fetch error: ${error.message}`);
        }
        return null;
    }
}

export async function getStrapiData<T = unknown>(url: string): Promise<T | null> {
    return fetchStrapi<T>(url);
}

export async function updateStrapiData<T = unknown>(
    endpoint: string,
    data: Record<string, unknown>
): Promise<T | null> {
    return fetchStrapi<T>(endpoint, {
        method: 'PUT',
        requiresAuth: true,
        body: JSON.stringify({ data }),
    });
}

