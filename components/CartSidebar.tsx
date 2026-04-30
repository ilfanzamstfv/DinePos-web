'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';
import CartItemRow from './CartItem';
import CheckoutButton from './CheckoutButton';
import { useState } from 'react';

const PAYMENT_METHODS = [
    { value: 'cash', label: 'Cash' },
    { value: 'qris', label: 'Qris' },
];

export default function CartSidebar() {
    const { items, subtotal, tax, total, clearCart, isCartOpen, closeCart } = useCartStore();

    // local state form checkout
    const [customerName, setCustomerName] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');

    const sub = subtotal();
    const taxAmt = tax();
    const totalAmt = total();
    const isEmpty = items.length === 0;

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isCartOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeCart}
                        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Panel - Desktop is static block, Mobile is fixed sliding panel */}
            <aside
                className={`
                    fixed right-0 top-0 z-50 flex h-full w-[340px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out
                    lg:static lg:z-auto lg:h-[calc(100vh-64px)] lg:shadow-none lg:translate-x-0 lg:border-l lg:border-stone-200/80
                    ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}
                `}
            >
                <CartContent
                    items={items}
                    sub={sub}
                    taxAmt={taxAmt}
                    totalAmt={totalAmt}
                    isEmpty={isEmpty}
                    clearCart={clearCart}
                    closeCart={closeCart}
                    customerName={customerName}
                    paymentMethod={paymentMethod}
                    setCustomerName={setCustomerName}
                    setPaymentMethod={setPaymentMethod}
                />
            </aside>
        </>
    );
}

interface CartContentProps {
    items: ReturnType<typeof useCartStore.getState>['items'];
    sub: number;
    taxAmt: number;
    totalAmt: number;
    isEmpty: boolean;
    clearCart: () => void;
    closeCart: () => void;
    customerName: string;
    paymentMethod: string;
    setCustomerName: (value: string) => void;
    setPaymentMethod: (value: string) => void;
}

function CartContent({
    items,
    sub,
    taxAmt,
    totalAmt,
    isEmpty,
    clearCart,
    closeCart,
    customerName,
    setCustomerName,
    paymentMethod,
    setPaymentMethod,
}: CartContentProps) {
    return (
        <div className="flex h-full flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stone-100 px-4 py-4">
                <div className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-[#5D866C]" />
                    <h2 className="text-base font-bold text-stone-800">Order Summary</h2>
                    {!isEmpty && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#5D866C] text-[10px] font-bold text-white">
                            {items.reduce((s, i) => s + i.quantity, 0)}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {!isEmpty && (
                        <button
                            onClick={clearCart}
                            className="rounded-lg px-2 py-1 text-xs font-medium text-stone-400 transition-colors hover:bg-red-50 hover:text-red-500"
                        >
                            Clear all
                        </button>
                    )}
                    <button
                        onClick={closeCart}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-stone-400 transition-colors hover:bg-stone-100 lg:hidden"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto px-4">
                <AnimatePresence mode="popLayout">
                    {isEmpty ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center gap-4 py-16 text-center"
                        >
                            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-stone-100">
                                <ShoppingBag className="h-9 w-9 text-stone-300" />
                            </div>
                            <div>
                                <p className="font-semibold text-stone-600">Your cart is empty</p>
                                <p className="mt-1 text-sm text-stone-400">
                                    Add items from the menu to get started
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div key="items" className="divide-y divide-stone-100">
                            <AnimatePresence mode="popLayout">
                                {items.map((item) => (
                                    <CartItemRow key={item.id} item={item} />
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Totals, form, Checkout */}
            {!isEmpty && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-t border-stone-100 px-4 py-4"
                >
                    {/* Breakdown */}
                    <div className="mb-3 space-y-1.5">
                        <div className="mb-3 space-y-2">
                            <div>
                                <label className="mb-1 block text-xs font-semibold text-stone-600">
                                    Nama Pemesan
                                </label>
                                <input
                                    type="text"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    placeholder="Masukkan nama anda"
                                    className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#5D866C] focus:ring-2 focus:ring-[#5D866C]/20"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-semibold text-stone-600">
                                    Metode Pembayaran
                                </label>
                                <select
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#5D866C] focus:ring-2 focus:ring-[#5D866C]/20"
                                >
                                    <option value="">Pilih metode pembayaran</option>
                                    {PAYMENT_METHODS.map((method) => (
                                        <option key={method.value} value={method.value}>
                                            {method.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-between text-sm text-stone-500">
                            <span>Subtotal</span>
                            <span>{formatPrice(sub)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-stone-500">
                            <span>Tax (10%)</span>
                            <span>{formatPrice(taxAmt)}</span>
                        </div>
                        <div className="my-2 border-t border-dashed border-stone-200" />
                        <div className="flex justify-between text-base font-bold text-stone-800">
                            <span>Total</span>
                            <span className="text-[#5D866C]">{formatPrice(totalAmt)}</span>
                        </div>
                    </div>

                    <CheckoutButton customerName={customerName} paymentMethod={paymentMethod} />
                </motion.div>
            )}
        </div>
    );
}
