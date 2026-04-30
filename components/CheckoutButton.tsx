'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, ShoppingCart, AlertCircle } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { generateOrderId } from '@/lib/utils';

// Midtrans Snap types
declare global {
    interface Window {
        snap?: {
            pay: (
                token: string,
                options: {
                    onSuccess: (result: unknown) => void;
                    onPending: (result: unknown) => void;
                    onError: (result: unknown) => void;
                    onClose: () => void;
                }
            ) => void;
        };
    }
}

const MIDTRANS_CLIENT_KEY = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '';

function loadSnapScript(): Promise<void> {
    return new Promise((resolve, reject) => {
        if (window.snap) {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
        script.setAttribute('data-client-key', MIDTRANS_CLIENT_KEY);
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Midtrans Snap'));
        document.head.appendChild(script);
    });
}

interface CheckoutButtonProps {
    customerName: string;
    paymentMethod: string;
}

export default function CheckoutButton({ customerName, paymentMethod }: CheckoutButtonProps) {
    const { items, total, clearCart, openReceipt } = useCartStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCheckout = async () => {
        if (items.length === 0) return;

        if (!customerName.trim()) {
            setError('Please enter customer name');
            return;
        }

        if (!paymentMethod) {
            setError('Please select payment method');
            return;
        }

        setLoading(true);
        setError(null);

        const orderId = generateOrderId();

        try {
            // 1. Get Midtrans token from our API
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    order_id: orderId,
                    gross_amount: total(),
                    customer_name: customerName.trim(), // statis
                    payment_method: paymentMethod,      // statis
                    items: items.map((item) => ({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                    })),
                }),
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || 'Checkout failed');
            }

            // 2. Demo mode — skip Snap, simulate success
            if (data.demo) {
                clearCart();
                openReceipt(orderId);
                return;
            }

            // 3. Load Snap and trigger payment popup
            await loadSnapScript();

            if (!window.snap) {
                throw new Error('Midtrans Snap failed to load');
            }

            window.snap.pay(data.token, {
                onSuccess: () => {
                    clearCart();
                    openReceipt(orderId);
                },
                onPending: () => {
                    // Order pending — still clear cart and show receipt
                    clearCart();
                    openReceipt(orderId);
                },
                onError: (result) => {
                    console.error('Payment error:', result);
                    setError('Payment failed. Please try again.');
                },
                onClose: () => {
                    // User closed popup without paying
                    setLoading(false);
                },
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600"
                >
                    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>{error}</span>
                </motion.div>
            )}

            <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleCheckout}
                disabled={loading || items.length === 0}
                className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#5D866C] px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-[#5D866C]/25 transition-all hover:bg-[#4a6e58] disabled:cursor-not-allowed disabled:opacity-50"
            >
                {loading ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Processing…</span>
                    </>
                ) : (
                    <>
                        <ShoppingCart className="h-4 w-4" />
                        <span>Checkout Now</span>
                    </>
                )}
            </motion.button>
        </div>
    );
}
