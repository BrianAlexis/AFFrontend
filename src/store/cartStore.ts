import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, CartStore } from '@/src/types';
import { generateCartItemId, findExistingCartItem, calculateCartTotal, calculateTotalItems } from '@/src/lib/utils/cart';

export { CartItem };

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,

            addItem: (item) => {
                const { items } = get();
                const existingItem = findExistingCartItem(items, item.productId, item.tamaño, item.precio);

                if (existingItem) {
                    set({
                        items: items.map((i) =>
                            i.id === existingItem.id
                                ? { ...i, cantidad: i.cantidad + item.cantidad }
                                : i
                        ),
                    });
                } else {
                    const newItem: CartItem = {
                        ...item,
                        id: generateCartItemId(item.productId, item.tamaño),
                    };
                    set({ items: [...items, newItem] });
                }
            },

            removeItem: (id) => {
                set({ items: get().items.filter((item) => item.id !== id) });
            },

            updateQuantity: (id, cantidad) => {
                if (cantidad <= 0) {
                    get().removeItem(id);
                } else {
                    set({
                        items: get().items.map((item) =>
                            item.id === id ? { ...item, cantidad } : item
                        ),
                    });
                }
            },

            clearCart: () => {
                set({ items: [] });
            },

            openCart: () => {
                set({ isOpen: true });
            },

            closeCart: () => {
                set({ isOpen: false });
            },

            toggleCart: () => {
                set({ isOpen: !get().isOpen });
            },

            getTotalItems: () => calculateTotalItems(get().items),

            getTotalPrice: () => calculateCartTotal(get().items),
        }),
        {
            name: 'cart-storage',
        }
    )
);

