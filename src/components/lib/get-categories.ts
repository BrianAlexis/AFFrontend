import { getStrapiData } from './strapi';
import type { Categoria } from '@/src/types/strapi';

export async function getAllCategories() {
    const data = await getStrapiData('/api/categorias?populate=*');
    const list = Array.isArray(data) ? data : [];
    const categories = list.map((item: Categoria) => ({
        id: item.id,
        nombre: item.nombre,
        slug: item.slug,
    }));

    return categories;
}