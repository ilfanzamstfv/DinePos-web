'use client';

import { motion, Variants } from 'framer-motion';
import { LayoutGrid, UtensilsCrossed, Coffee, IceCream2, Flame } from 'lucide-react';
import { Category } from '@/lib/types';

interface CategorySidebarProps {
    selected: Category;
    onSelect: (category: Category) => void;
    counts: Record<Category, number>;
}

const categories: { id: Category; label: string; icon: React.ElementType; color: string }[] = [
    { id: 'All', label: 'All Items', icon: LayoutGrid, color: 'text-stone-600' },
    { id: 'Food', label: 'Food', icon: UtensilsCrossed, color: 'text-amber-600' },
    { id: 'Drinks', label: 'Drinks', icon: Coffee, color: 'text-blue-500' },
    { id: 'Desserts', label: 'Desserts', icon: IceCream2, color: 'text-pink-500' },
];

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, x: -16 },
    show: { opacity: 1, x: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

export default function CategorySidebar({ selected, onSelect, counts }: CategorySidebarProps) {
    return (
        <aside className="flex flex-col gap-2 py-4">
            {/* Title */}
            <div className="mb-2 px-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">
                    Categories
                </p>
            </div>

            <motion.nav
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="flex flex-col gap-1"
            >
                {categories.map(({ id, label, icon: Icon, color }) => {
                    const isActive = selected === id;
                    return (
                        <motion.button
                            key={id}
                            variants={itemVariants}
                            onClick={() => onSelect(id)}
                            className={`
                group relative flex items-center gap-3 rounded-xl px-3 py-3 text-left transition-all
                ${isActive
                                    ? 'bg-[#5D866C] text-white shadow-md shadow-[#5D866C]/20'
                                    : 'text-stone-600 hover:bg-stone-100/80'
                                }
              `}
                        >
                            {/* Active indicator */}
                            {isActive && (
                                <motion.div
                                    layoutId="activeCategory"
                                    className="absolute inset-0 rounded-xl bg-[#5D866C]"
                                    style={{ zIndex: -1 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                />
                            )}

                            {/* Icon */}
                            <div
                                className={`
                  flex h-8 w-8 items-center justify-center rounded-lg transition-colors
                  ${isActive ? 'bg-white/20' : 'bg-stone-100 group-hover:bg-stone-200'}
                `}
                            >
                                <Icon
                                    className={`h-4 w-4 ${isActive ? 'text-white' : color}`}
                                />
                            </div>

                            {/* Label */}
                            <span className={`flex-1 text-sm font-medium ${isActive ? 'text-white' : ''}`}>
                                {label}
                            </span>

                            {/* Count Badge */}
                            <span
                                className={`
                  min-w-[24px] rounded-full px-1.5 py-0.5 text-center text-xs font-bold
                  ${isActive
                                        ? 'bg-white/20 text-white'
                                        : 'bg-stone-200 text-stone-500'
                                    }
                `}
                            >
                                {counts[id]}
                            </span>
                        </motion.button>
                    );
                })}
            </motion.nav>

            {/* Popular badge info */}
            <div className="mt-4 rounded-xl bg-[#C2A68C]/10 px-3 py-3 border border-[#C2A68C]/20">
                <div className="flex items-center gap-2 mb-1">
                    <Flame className="h-3.5 w-3.5 text-[#C2A68C]" />
                    <p className="text-xs font-semibold text-[#C2A68C]">Popular Items</p>
                </div>
                <p className="text-[11px] text-stone-500 leading-4">
                    Items marked with a flame badge are customer favorites.
                </p>
            </div>
        </aside>
    );
}
