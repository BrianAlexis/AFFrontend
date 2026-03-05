export interface CartItem {
    id: string;
    productId: number;
    documentId: string;
    titulo: string;
    slug: string;
    precio: number;
    cantidad: number;
    tamaño?: string;
    imagen?: string;
}

export interface CartStore {
    items: CartItem[];
    isOpen: boolean;
    addItem: (item: Omit<CartItem, 'id'>) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, cantidad: number) => void;
    clearCart: () => void;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
}

