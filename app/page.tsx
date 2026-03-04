'use client';

import { useEffect } from 'react';
import Header from '@/components/Header';
import CategorySidebar from '@/components/CategorySidebar';
import MenuGrid from '@/components/MenuGrid';
import CartSidebar from '@/components/CartSidebar';
import ReceiptModal from '@/components/ReceiptModal';
import { useMenu } from '@/hooks/useMenu';

export default function HomePage() {
  const { items, selectedCategory, setCategory, loading, categoryCounts } = useMenu();

  // Prevent body scroll on mobile when cart is open (handled by CSS)
  useEffect(() => {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    const handleResize = () => {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F0]">
      {/* Fixed Top Header */}
      <Header />

      {/* Main Content — below fixed header (h-16 = 64px) */}
      <div className="flex flex-1 pt-16">
        {/* Three-column layout on desktop */}
        <div className="mx-auto flex w-full max-w-screen-2xl flex-1">

          {/* ── LEFT SIDEBAR: Categories ─────────────────────────────────────── */}
          <aside className="hidden w-60 flex-shrink-0 border-r border-stone-200/80 px-3 lg:block">
            <div className="sticky top-16 max-h-[calc(100vh-64px)] overflow-y-auto py-2">
              <CategorySidebar
                selected={selectedCategory}
                onSelect={setCategory}
                counts={categoryCounts}
              />
            </div>
          </aside>

          {/* ── CENTER: Menu Grid ─────────────────────────────────────────────── */}
          <main className="min-w-0 flex-1 px-4 sm:px-6">
            <MenuGrid
              items={items}
              selectedCategory={selectedCategory}
              loading={loading}
            />
          </main>

          {/* ── RIGHT SIDEBAR: Cart (desktop static) ─────────────────────────── */}
          <aside className="hidden w-[350px] flex-shrink-0 border-l border-stone-200/80 lg:block">
            <div className="sticky top-16 max-h-[calc(100vh-64px)] overflow-y-auto">
              <CartSidebar />
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile Cart Slide-over */}
      <div className="lg:hidden">
        <CartSidebar />
      </div>

      {/* Receipt Success Modal */}
      <ReceiptModal />
    </div>
  );
}
