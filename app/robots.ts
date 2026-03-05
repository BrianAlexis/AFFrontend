import { MetadataRoute } from 'next';
import { NEXT_PUBLIC_BASE_URL } from '@/src/lib/constants';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/checkout/'],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}

