'use client';

import { motion } from 'framer-motion';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store/useCartStore';

interface CartItemProps {
    item: CartItemType;
}

export default function CartItemRow({ item }: CartItemProps) {
    const { removeItem, updateQuantity } = useCartStore();

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="flex items-center gap-3 py-2.5"
        >
            {/* Emoji Avatar */}
            <div
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-lg`}
            >
                {item.emoji}
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-sm font-semibold text-stone-800">{item.name}</p>
                <p className="text-xs text-stone-500">{formatPrice(item.price)} each</p>
            </div>

            {/* Controls */}
            <div className="flex flex-shrink-0 items-center gap-1.5">
                <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="flex h-6 w-6 items-center justify-center rounded-lg bg-stone-100 text-stone-600 transition-colors hover:bg-stone-200 active:scale-90"
                >
                    <Minus className="h-3 w-3" strokeWidth={2.5} />
                </button>

                <motion.span
                    key={item.quantity}
                    initial={{ scale: 0.7 }}
                    animate={{ scale: 1 }}
                    className="w-6 text-center text-sm font-bold text-stone-800"
                >
                    {item.quantity}
                </motion.span>

                <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#5D866C]/10 text-[#5D866C] transition-colors hover:bg-[#5D866C]/20 active:scale-90"
                >
                    <Plus className="h-3 w-3" strokeWidth={2.5} />
                </button>
            </div>

            {/* Total + Delete */}
            <div className="flex flex-shrink-0 flex-col items-end gap-1">
                <span className="text-xs font-bold text-stone-800">
                    {formatPrice(item.price * item.quantity)}
                </span>
                <button
                    onClick={() => removeItem(item.id)}
                    className="text-stone-300 transition-colors hover:text-red-400 active:scale-90"
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </button>
            </div>
        </motion.div>
    );
}
