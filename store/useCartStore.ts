'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, MenuItem } from '@/lib/types';
import { calculateTax } from '@/lib/utils';

interface CartStore {
    // State
    items: CartItem[];
    isCartOpen: boolean;
    isReceiptOpen: boolean;
    lastOrderId: string | null;

    // Computed (functions, not state)
    itemCount: () => number;
    subtotal: () => number;
    tax: () => number;
    total: () => number;

    // Actions
    addItem: (item: MenuItem) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    toggleCart: () => void;
    openCart: () => void;
    closeCart: () => void;
    openReceipt: (orderId: string) => void;
    closeReceipt: () => void;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            // ─── Initial State ─────────────────────────────────────────────────────────
            items: [],
            isCartOpen: false,
            isReceiptOpen: false,
            lastOrderId: null,

            // ─── Computed Values ───────────────────────────────────────────────────────
            itemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
            subtotal: () =>
                get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
            tax: () => calculateTax(get().subtotal()),
            total: () => get().subtotal() + get().tax(),

            // ─── Actions ───────────────────────────────────────────────────────────────
            addItem: (menuItem: MenuItem) => {
                set((state) => {
                    const existing = state.items.find((i) => i.id === menuItem.id);
                    if (existing) {
                        return {
                            items: state.items.map((i) =>
                                i.id === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i
                            ),
                        };
                    }
                    return { items: [...state.items, { ...menuItem, quantity: 1 }] };
                });
            },

            removeItem: (id: string) => {
                set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
            },

            updateQuantity: (id: string, quantity: number) => {
                if (quantity < 1) {
                    get().removeItem(id);
                    return;
                }
                set((state) => ({
                    items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
                }));
            },

            clearCart: () => set({ items: [] }),

            toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
            openCart: () => set({ isCartOpen: true }),
            closeCart: () => set({ isCartOpen: false }),

            openReceipt: (orderId: string) =>
                set({ isReceiptOpen: true, lastOrderId: orderId }),
            closeReceipt: () =>
                set({ isReceiptOpen: false, lastOrderId: null }),
        }),
        {
            name: 'pos-cart-storage',
            storage: createJSONStorage(() => localStorage),
            // Only persist items, not UI state
            partialize: (state) => ({ items: state.items }),
        }
    )
);
