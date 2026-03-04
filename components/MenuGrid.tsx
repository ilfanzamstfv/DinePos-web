'use client';

import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Search, PackageOpen } from 'lucide-react';
import { MenuItem, Category } from '@/lib/types';
import MenuCard from './MenuCard';
import { useState } from 'react';

interface MenuGridProps {
    items: MenuItem[];
    selectedCategory: Category;
    loading?: boolean;
}

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.06,
            delayChildren: 0.05,
        },
    },
};

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.96 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: 'spring' as const, stiffness: 300, damping: 26 },
    },
    exit: {
        opacity: 0,
        scale: 0.94,
        transition: { duration: 0.15 },
    },
};

const SkeletonCard = () => (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-stone-200/60">
        <div className="h-32 animate-pulse bg-stone-100" />
        <div className="flex flex-col gap-2 p-3">
            <div className="h-3.5 w-3/4 animate-pulse rounded bg-stone-100" />
            <div className="h-3 w-full animate-pulse rounded bg-stone-100" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-stone-100" />
            <div className="mt-1 flex justify-between">
                <div className="h-4 w-20 animate-pulse rounded bg-stone-100" />
                <div className="h-7 w-7 animate-pulse rounded-lg bg-stone-100" />
            </div>
        </div>
    </div>
);

export default function MenuGrid({ items, selectedCategory, loading = false }: MenuGridProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredItems = items.filter((item) => {
        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
        const matchesSearch =
            searchQuery === '' ||
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="flex flex-col gap-4 py-4">
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search menu..."
                    className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-10 pr-4 text-sm text-stone-700 placeholder-stone-400 outline-none transition-all focus:border-[#5D866C] focus:ring-2 focus:ring-[#5D866C]/15"
                />
            </div>

            {/* Category Label */}
            <div className="flex items-center justify-between">
                <motion.h2
                    key={selectedCategory}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-base font-semibold text-stone-800"
                >
                    {selectedCategory === 'All' ? 'All Menu Items' : selectedCategory}
                </motion.h2>
                {!loading && (
                    <span className="text-xs text-stone-400">
                        {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
                    </span>
                )}
            </div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            ) : filteredItems.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center gap-3 py-20 text-center"
                >
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-100">
                        <PackageOpen className="h-8 w-8 text-stone-400" />
                    </div>
                    <div>
                        <p className="font-semibold text-stone-600">No items found</p>
                        <p className="text-sm text-stone-400">
                            {searchQuery ? `No results for "${searchQuery}"` : 'This category is empty'}
                        </p>
                    </div>
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="rounded-lg bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-200"
                        >
                            Clear search
                        </button>
                    )}
                </motion.div>
            ) : (
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${selectedCategory}-${searchQuery}`}
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-2 gap-3 xl:grid-cols-3"
                    >
                        {filteredItems.map((item) => (
                            <motion.div key={item.id} variants={cardVariants} layout>
                                <MenuCard item={item} />
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    );
}
