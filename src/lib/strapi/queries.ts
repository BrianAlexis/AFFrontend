import { getStrapiData } from '@/src/components/lib/strapi';
import type { Producto, CategoriaConProductos } from '@/src/types';

const PRODUCT_FIELDS = [
    'titulo',
    'descripcion',
    'cantidadpersonas',
    'slug',
    'precioSolo',
    'stock',
] as const;

const PRECIO_FIELDS = ['precio', 'cantidadPersonasMin', 'cantidadPersonasMax'] as const;

const CATEGORIA_FIELDS = ['nombre', 'slug'] as const;

const IMAGE_FIELDS = ['url'] as const;

export const strapiQueries = {
    products: {
        bySlug: async (slug: string): Promise<Producto | null> => {
            const query = buildProductQuery({ slug });
            const data = await getStrapiData(query);
            return data?.[0] || null;
        },

        all: async (): Promise<Producto[]> => {
            const query = buildProductQuery();
            return await getStrapiData(query);
        },
    },

    categories: {
        bySlug: async (slug: string): Promise<CategoriaConProductos | null> => {
            const query = buildCategoryQuery(slug);
            const data = await getStrapiData(query);
            return data?.[0] || null;
        },
    },
};

function buildProductQuery(filters?: { slug?: string }): string {
    const baseUrl = '/api/products?';
    const params: string[] = [];

    if (filters?.slug) {
        params.push(`filters[slug][$eq]=${filters.slug}`);
    }

    PRODUCT_FIELDS.forEach((field, index) => {
        params.push(`fields[${index}]=${field}`);
    });

    params.push('populate[imagen][fields][0]=url');
    params.push('populate[categorias][fields][0]=nombre');
    params.push('populate[categorias][fields][1]=slug');

    PRECIO_FIELDS.forEach((field, index) => {
        params.push(`populate[Precio][fields][${index}]=${field}`);
    });

    params.push('populate[Precio][populate][tamano][fields][0]=nombre');

    return baseUrl + params.join('&');
}

function buildCategoryQuery(slug: string): string {
    const params: string[] = [
        `filters[slug][$eq]=${slug}`,
        'populate[productos][populate][imagen][fields][0]=id',
        'populate[productos][populate][imagen][fields][1]=url',
        'populate[productos][fields][0]=id',
        'populate[productos][fields][1]=documentId',
        'populate[productos][fields][2]=titulo',
        'populate[productos][fields][3]=descripcion',
        'populate[productos][fields][4]=slug',
        'populate[productos][fields][5]=precioSolo',
        'populate[productos][populate][Precio][fields][0]=precio',
    ];

    return '/api/categorias?' + params.join('&');
}

