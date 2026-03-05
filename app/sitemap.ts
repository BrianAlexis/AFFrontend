import { MetadataRoute } from 'next';
import { getStrapiData } from '@/src/components/lib/strapi';
import type { Producto } from '@/src/types/strapi';
import { NEXT_PUBLIC_BASE_URL } from '@/src/lib/constants';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    let products: Producto[] = [];
    try {
        const productsQuery = "/api/products?fields[0]=slug&fields[1]=titulo";
        const productsData = await getStrapiData(productsQuery);
        products = (productsData as Producto[]) || [];
    } catch (error) {
        console.error('Error obteniendo productos para sitemap:', error);
    }

    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${baseUrl}/#products`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/#contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
    ];

    const productPages: MetadataRoute.Sitemap = products.map((product) => ({
        url: `${baseUrl}/productos/${product.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
    }));

    return [...staticPages, ...productPages];
}

