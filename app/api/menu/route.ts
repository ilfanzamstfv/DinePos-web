import { NextResponse } from 'next/server';
import { menuItems } from '@/lib/menu-data';

/**
 * GET /api/menu
 * Returns all menu items from the mock data store
 */
export async function GET() {
    try {
        return NextResponse.json({
            success: true,
            data: menuItems,
            total: menuItems.length,
        });
    } catch (error) {
        console.error('Failed to fetch menu:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to load menu' },
            { status: 500 }
        );
    }
}
