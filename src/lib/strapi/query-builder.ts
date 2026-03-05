type QueryField = string;
type PopulateValue = string | Record<string, unknown> | boolean;

export class StrapiQueryBuilder {
    private filters: Record<string, unknown> = {};
    private fields: QueryField[] = [];
    private populates: Record<string, PopulateValue> = {};
    private sortBy?: string;
    private limitValue?: number;

    filter(key: string, operator: string, value: unknown): this {
        this.filters[`filters[${key}][${operator}]`] = value;
        return this;
    }

    addFields(...fieldNames: QueryField[]): this {
        this.fields.push(...fieldNames);
        return this;
    }

    populate(field: string, config?: PopulateValue): this {
        this.populates[field] = config || true;
        return this;
    }

    sort(field: string, order: 'asc' | 'desc' = 'asc'): this {
        this.sortBy = `${field}:${order}`;
        return this;
    }

    limit(value: number): this {
        this.limitValue = value;
        return this;
    }

    build(): string {
        const params = new URLSearchParams();

        Object.entries(this.filters).forEach(([key, value]) => {
            params.append(key, String(value));
        });

        this.fields.forEach((field, index) => {
            params.append(`fields[${index}]`, field);
        });

        Object.entries(this.populates).forEach(([field, config]) => {
            if (config === true) {
                params.append(`populate[${field}]`, '*');
            } else if (typeof config === 'string') {
                params.append(`populate[${field}]`, config);
            } else {
                Object.entries(config).forEach(([key, value]) => {
                    params.append(`populate[${field}][${key}]`, String(value));
                });
            }
        });

        if (this.sortBy) {
            params.append('sort', this.sortBy);
        }

        if (this.limitValue) {
            params.append('pagination[limit]', String(this.limitValue));
        }

        return params.toString();
    }
}

export function createProductQuery(slug: string): string {
    return new StrapiQueryBuilder()
        .filter('slug', '$eq', slug)
        .addFields('titulo', 'descripcion', 'cantidadpersonas', 'slug', 'precioSolo', 'stock', 'documentId')
        .populate('imagen', { 'fields[0]': 'url' })
        .populate('categorias', { 'fields[0]': 'nombre', 'fields[1]': 'slug' })
        .populate('Precio', {
            'fields[0]': 'precio',
            'fields[1]': 'cantidadPersonasMin',
            'fields[2]': 'cantidadPersonasMax',
            'populate[tamano][fields][0]': 'nombre'
        })
        .build();
}

export function createCategoryProductsQuery(categorySlug: string): string {
    return new StrapiQueryBuilder()
        .filter('slug', '$eq', categorySlug)
        .populate('productos', {
            'populate[imagen][fields][0]': 'id',
            'populate[imagen][fields][1]': 'url',
            'populate[Precio][fields][0]': 'precio',
            'fields[0]': 'id',
            'fields[1]': 'documentId',
            'fields[2]': 'titulo',
            'fields[3]': 'descripcion',
            'fields[4]': 'slug',
            'fields[5]': 'precioSolo'
        })
        .build();
}

