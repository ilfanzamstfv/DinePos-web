import { NextRequest, NextResponse } from 'next/server';

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || '';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const MIDTRANS_BASE_URL = IS_PRODUCTION
    ? 'https://app.midtrans.com/snap/v1/transactions'
    : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

/**
 * POST /api/checkout
 * Creates a Midtrans Snap transaction and returns the payment token.
 *
 * Body: {
 *   order_id: string,
 *   gross_amount: number,
 *   items: { id, name, price, quantity }[],
 *   customer?: { name, email, phone }
 * }
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { order_id, gross_amount, items, customer } = body;

        // Validate required fields
        if (!order_id || !gross_amount || !items?.length) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // If no server key is configured, return a demo response
        if (!MIDTRANS_SERVER_KEY) {
            console.warn('[Checkout] MIDTRANS_SERVER_KEY is not set. Returning demo token.');
            return NextResponse.json({
                success: true,
                token: 'demo-token-no-key',
                redirect_url: null,
                demo: true,
                message: 'Demo mode: set MIDTRANS_SERVER_KEY in .env.local to enable real payments',
            });
        }

        // Build Midtrans payload
        const payload = {
            transaction_details: {
                order_id,
                gross_amount: Math.round(gross_amount),
            },
            item_details: items.map((item: { id: string; name: string; price: number; quantity: number }) => ({
                id: item.id,
                price: Math.round(item.price),
                quantity: item.quantity,
                name: item.name.substring(0, 50), // Midtrans name max 50 chars
            })),
            customer_details: customer
                ? {
                    first_name: customer.name || 'Guest',
                    email: customer.email || 'guest@example.com',
                    phone: customer.phone || '08000000000',
                }
                : {
                    first_name: 'Guest',
                    email: 'guest@example.com',
                    phone: '08000000000',
                },
        };

        // Call Midtrans API
        const authHeader = Buffer.from(`${MIDTRANS_SERVER_KEY}:`).toString('base64');
        const midtransResponse = await fetch(MIDTRANS_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Basic ${authHeader}`,
            },
            body: JSON.stringify(payload),
        });

        const midtransData = await midtransResponse.json();

        if (!midtransResponse.ok) {
            console.error('[Checkout] Midtrans error:', midtransData);
            return NextResponse.json(
                {
                    success: false,
                    message: midtransData.error_messages?.join(', ') || 'Payment initialization failed',
                },
                { status: midtransResponse.status }
            );
        }

        return NextResponse.json({
            success: true,
            token: midtransData.token,
            redirect_url: midtransData.redirect_url,
        });
    } catch (error) {
        console.error('[Checkout] Internal error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
