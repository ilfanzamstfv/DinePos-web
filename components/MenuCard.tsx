'use client';

import { motion } from 'framer-motion';
import { Plus, Flame } from 'lucide-react';
import { MenuItem } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store/useCartStore';

interface MenuCardProps {
    item: MenuItem;
}

export default function MenuCard({ item }: MenuCardProps) {
    const { addItem, items } = useCartStore();

    const cartItem = items.find((i) => i.id === item.id);
    const quantity = cartItem?.quantity ?? 0;

    const handleAdd = () => {
        addItem(item);
    };

    return (
        <motion.div
            layout
            whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
            className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200/60 transition-shadow hover:shadow-md hover:ring-stone-300/60"
        >
            {/* Popular Badge */}
            {item.popular && (
                <div className="absolute left-2.5 top-2.5 z-10 flex items-center gap-1 rounded-full bg-[#C2A68C] px-2 py-0.5 shadow-sm">
                    <Flame className="h-2.5 w-2.5 text-white" />
                    <span className="text-[9px] font-bold uppercase tracking-wide text-white">Popular</span>
                </div>
            )}

            {/* Quantity indicator (if in cart) */}
            {quantity > 0 && (
                <motion.div
                    key={quantity}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-2.5 top-2.5 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-[#5D866C] text-xs font-bold text-white shadow-sm"
                >
                    {quantity}
                </motion.div>
            )}

            {/* Image / Emoji Placeholder */}
            <div
                className={`relative flex h-32 items-center justify-center bg-gradient-to-br ${item.color} overflow-hidden`}
            >
                <span className="text-5xl drop-shadow-sm">{item.emoji}</span>
                {/* Decorative circles */}
                <div className="absolute -bottom-4 -right-4 h-16 w-16 rounded-full bg-white/10" />
                <div className="absolute -top-2 -left-2 h-10 w-10 rounded-full bg-white/10" />
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col gap-1 p-3">
                <h3 className="line-clamp-1 text-sm font-semibold text-stone-800">{item.name}</h3>
                <p className="line-clamp-2 text-[11px] leading-4 text-stone-500">{item.description}</p>

                <div className="mt-auto flex items-center justify-between pt-2">
                    <span className="text-sm font-bold text-[#5D866C]">{formatPrice(item.price)}</span>

                    {/* Add Button */}
                    <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={handleAdd}
                        className={`
              flex h-7 w-7 items-center justify-center rounded-lg transition-colors
              ${quantity > 0
                                ? 'bg-[#5D866C] text-white shadow-sm'
                                : 'bg-stone-100 text-stone-600 hover:bg-[#5D866C] hover:text-white'
                            }
            `}
                    >
                        <Plus className="h-4 w-4" strokeWidth={2.5} />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}
