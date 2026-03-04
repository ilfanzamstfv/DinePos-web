'use client';

import { useState, useEffect, useMemo } from 'react';
import { MenuItem, Category } from '@/lib/types';
import { menuItems as staticMenuItems } from '@/lib/menu-data';

interface UseMenuReturn {
    items: MenuItem[];
    filteredItems: MenuItem[];
    selectedCategory: Category;
    setCategory: (category: Category) => void;
    loading: boolean;
    error: string | null;
    categoryCounts: Record<Category, number>;
}

export function useMenu(): UseMenuReturn {
    const [items, setItems] = useState<MenuItem[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category>('All');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/menu');
                if (!response.ok) throw new Error('Failed to fetch menu');
                const data = await response.json();
                setItems(data.data ?? staticMenuItems);
            } catch (err) {
                console.error('useMenu fetch error:', err);
                // Fallback to static data
                setItems(staticMenuItems);
                setError('Using cached menu data');
            } finally {
                setLoading(false);
            }
        };

        fetchMenu();
    }, []);

    const filteredItems = useMemo(() => {
        if (selectedCategory === 'All') return items;
        return items.filter((item) => item.category === selectedCategory);
    }, [items, selectedCategory]);

    const categoryCounts = useMemo(() => {
        const counts: Record<Category, number> = {
            All: items.length,
            Food: 0,
            Drinks: 0,
            Desserts: 0,
        };
        for (const item of items) {
            counts[item.category]++;
        }
        return counts;
    }, [items]);

    return {
        items,
        filteredItems,
        selectedCategory,
        setCategory: setSelectedCategory,
        loading,
        error,
        categoryCounts,
    };
}
