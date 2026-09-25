'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, ChefHat, LogIn } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import Link from 'next/link';

export default function Header() {
    const { itemCount, toggleCart } = useCartStore();
    const count = itemCount();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-stone-200/80 bg-[#F5F5F0]/90 backdrop-blur-md">
            <div className="mx-auto flex h-full max-w-screen-2xl items-center justify-between px-4 sm:px-6">
                {/* Brand */}
                <motion.div
                    className="flex items-center gap-2.5"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#5D866C]">
                        <ChefHat className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold leading-none tracking-tight text-stone-800">
                            DinePos
                        </h1>
                        <p className="text-[10px] font-medium leading-none text-[#5D866C]">
                            Modern F&amp;B POS
                        </p>
                    </div>
                </motion.div>

                {/* Right side */}
                <motion.div
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="hidden sm:block text-right">
                        <p className="text-xs font-medium text-stone-500 min-w-[150px]">
                            {mounted ? new Date().toLocaleDateString('id-ID', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            }) : '\u00A0'}
                        </p>
                    </div>

                    <Link
                        href="/auth"
                        className='inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm font-semibold text-stone-700 transition hover:border-[#5D866C] hover:text-[#5D866C]'
                    >
                        <LogIn className='h-4 w-4' />
                        <span className='hidden sm:inline'>Login Admin</span>
                        <span className='sm:hidden'>Login</span>
                    </Link>

                    {/* Cart Button (mobile only) */}
                    <button
                        onClick={toggleCart}
                        className="relative flex items-center gap-2 rounded-xl bg-[#5D866C] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#4a6e58] active:scale-95 lg:hidden"
                    >
                        <ShoppingCart className="h-4 w-4" />
                        <span>Cart</span>
                        {count > 0 && (
                            <motion.span
                                key={count}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#C2A68C] text-[10px] font-bold text-white"
                            >
                                {count > 9 ? '9+' : count}
                            </motion.span>
                        )}
                    </button>
                </motion.div>
            </div>
        </header>
    );
}
