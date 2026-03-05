export interface Categoria {
    id: number;
    documentId: string;
    nombre: string;
    slug: string;
}

export interface Precio {
    id: number;
    precio: number;
    cantidadPersonasMin?: number;
    cantidadPersonasMax?: number;
}

export interface Imagen {
    id: number;
    documentId: string;
    url: string;
    formats?: {
        small?: { url: string };
        medium?: { url: string };
        large?: { url: string };
    };
}

export interface Producto {
    id: number;
    documentId: string;
    titulo: string;
    descripcion: string;
    slug: string;
    cantidadpersonas: string;
    stock: number;
    imagen: Imagen | null;
    categorias: Categoria[];
    Precio: Precio[];
    nombre: string;
    precioSolo: number;
}

export interface CategoriaConProductos {
    id: number;
    documentId: string;
    nombre: string;
    slug: string;
    productos: Producto[];
}
