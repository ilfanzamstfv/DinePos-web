'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Download, RefreshCw, X, Receipt } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice, formatDate } from '@/lib/utils';
import { generateReceiptPdf } from '@/lib/generatePdf';
import { Order } from '@/lib/types';

export default function ReceiptModal() {
    const { isReceiptOpen, closeReceipt, lastOrderId, items } = useCartStore();

    if (!isReceiptOpen || !lastOrderId) return null;

    // Reconstruct the order for PDF generation
    // (items are cleared on checkout success, so we hold a snapshot at render time)
    const handleDownloadPdf = () => {
        // Create a minimal order object for the PDF
        // In a real app you'd fetch this from the DB; here we use store state snapshot
        const order: Order = {
            id: lastOrderId,
            items: items,
            subtotal: items.reduce((s, i) => s + i.price * i.quantity, 0),
            tax: Math.round(items.reduce((s, i) => s + i.price * i.quantity, 0) * 0.1),
            total: Math.round(
                items.reduce((s, i) => s + i.price * i.quantity, 0) * 1.1
            ),
            timestamp: new Date(),
            status: 'paid',
        };
        generateReceiptPdf(order);
    };

    const handleNewOrder = () => {
        closeReceipt();
    };

    return (
        <AnimatePresence>
            {isReceiptOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.85, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.85, opacity: 0, y: 30 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
                        >
                            {/* Close Button */}
                            <button
                                onClick={closeReceipt}
                                className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-500 transition-colors hover:bg-stone-200"
                            >
                                <X className="h-4 w-4" />
                            </button>

                            {/* Success Header */}
                            <div className="bg-gradient-to-br from-[#5D866C] to-[#4a6e58] px-6 py-8 text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: 'spring', stiffness: 400 }}
                                    className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white/20"
                                >
                                    <CheckCircle2 className="h-8 w-8 text-white" />
                                </motion.div>
                                <h2 className="text-xl font-bold text-white">Payment Successful!</h2>
                                <p className="mt-1 text-sm text-white/80">
                                    Your order has been confirmed
                                </p>
                            </div>

                            {/* Order Details */}
                            <div className="px-6 py-4">
                                <div className="mb-4 flex items-center gap-2 rounded-xl bg-stone-50 px-4 py-3">
                                    <Receipt className="h-4 w-4 text-stone-400" />
                                    <div>
                                        <p className="text-xs text-stone-400">Order ID</p>
                                        <p className="font-mono text-sm font-semibold text-stone-700">
                                            {lastOrderId}
                                        </p>
                                    </div>
                                    <div className="ml-auto text-right">
                                        <p className="text-xs text-stone-400">Date</p>
                                        <p className="text-xs font-medium text-stone-600">
                                            {formatDate(new Date())}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between font-semibold text-stone-800">
                                        <span>Payment Status</span>
                                        <span className="flex items-center gap-1 text-[#5D866C]">
                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                            Paid
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="grid grid-cols-2 gap-3 px-6 pb-6">
                                <motion.button
                                    whileTap={{ scale: 0.97 }}
                                    onClick={handleDownloadPdf}
                                    className="flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-50"
                                >
                                    <Download className="h-4 w-4" />
                                    Download PDF
                                </motion.button>

                                <motion.button
                                    whileTap={{ scale: 0.97 }}
                                    onClick={handleNewOrder}
                                    className="flex items-center justify-center gap-2 rounded-xl bg-[#5D866C] px-4 py-3 text-sm font-semibold text-white shadow-md shadow-[#5D866C]/20 transition-colors hover:bg-[#4a6e58]"
                                >
                                    <RefreshCw className="h-4 w-4" />
                                    New Order
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
