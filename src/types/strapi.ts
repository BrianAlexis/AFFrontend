export interface StrapiEntity {
    id: number;
    documentId: string;
}

export interface Categoria extends StrapiEntity {
    nombre: string;
    slug: string;
}

export interface Tamano extends StrapiEntity {
    nombre: string;
}

export interface Precio {
    id: number;
    precio: number;
    cantidadPersonasMin?: number;
    cantidadPersonasMax?: number;
    tamano?: Tamano;
}

export interface ImagenFormats {
    small?: { url: string };
    medium?: { url: string };
    large?: { url: string };
}

export interface Imagen extends StrapiEntity {
    url: string;
    formats?: ImagenFormats;
}

export interface Producto extends StrapiEntity {
    titulo: string;
    descripcion: string;
    slug: string;
    cantidadpersonas: string;
    stock: number;
    precioSolo: number | null;
    imagen: Imagen | null;
    categorias: Categoria[];
    Precio: Precio[];
}

export interface CategoriaConProductos extends Categoria {
    productos: Producto[];
}

export type PrecioVariante = Precio & { tamano?: Tamano };

