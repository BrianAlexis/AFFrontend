import { NEXT_PUBLIC_BASE_URL } from '@/src/lib/constants';

interface StructuredDataProps {
    type: 'organization' | 'product' | 'breadcrumb';
    data?: {
        product?: {
            name: string;
            description: string;
            image?: string;
            price?: number;
            currency?: string;
        };
        breadcrumbs?: Array<{ name: string; url: string }>;
    };
}

export default function StructuredData({ type, data }: StructuredDataProps) {
    const siteUrl = NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const getStructuredData = () => {
        switch (type) {
            case 'organization':
                return {
                    '@context': 'https://schema.org',
                    '@type': 'LocalBusiness',
                    '@id': siteUrl,
                    name: 'Andrea Franceschini La Falda',
                    description: 'Pastelería artesanal de alta calidad en La Falda, Córdoba. Cada creación hecha con amor y dedicación.',
                    image: `${siteUrl}/logo.png`,
                    address: {
                        '@type': 'PostalAddress',
                        addressLocality: 'La Falda',
                        addressRegion: 'Córdoba',
                        addressCountry: 'AR',
                    },
                    telephone: '+54 9 351 - 2186616',
                    url: siteUrl,
                    priceRange: '$$',
                    openingHours: [
                        'Mo-Su 09:30-13:30',
                        'Mo-Su 17:00-21:00',
                    ],
                    sameAs: [
                        'https://www.instagram.com/andrea_franceschini_lafalda',
                    ],
                };

            case 'product':
                if (!data?.product) return null;
                return {
                    '@context': 'https://schema.org',
                    '@type': 'Product',
                    name: data.product.name,
                    description: data.product.description,
                    image: data.product.image || `${siteUrl}/logo.png`,
                    ...(data.product.price && {
                        offers: {
                            '@type': 'Offer',
                            price: data.product.price,
                            priceCurrency: data.product.currency || 'ARS',
                            availability: 'https://schema.org/InStock',
                        },
                    }),
                };

            case 'breadcrumb':
                if (!data?.breadcrumbs) return null;
                return {
                    '@context': 'https://schema.org',
                    '@type': 'BreadcrumbList',
                    itemListElement: data.breadcrumbs.map((crumb, index) => ({
                        '@type': 'ListItem',
                        position: index + 1,
                        name: crumb.name,
                        item: `${siteUrl}${crumb.url}`,
                    })),
                };

            default:
                return null;
        }
    };

    const structuredData = getStructuredData();

    if (!structuredData) return null;

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    );
}

