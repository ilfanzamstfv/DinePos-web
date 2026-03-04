import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || '';

/**
 * POST /api/payment/notification
 * Handles Midtrans payment status notification (webhook).
 * Verifies the signature key and processes payment status updates.
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            order_id,
            status_code,
            gross_amount,
            signature_key,
            transaction_status,
            fraud_status,
        } = body;

        console.log('[Payment Notification] Received:', {
            order_id,
            transaction_status,
            fraud_status,
        });

        // Verify Midtrans signature
        if (MIDTRANS_SERVER_KEY && signature_key) {
            const expectedSignature = crypto
                .createHash('sha512')
                .update(`${order_id}${status_code}${gross_amount}${MIDTRANS_SERVER_KEY}`)
                .digest('hex');

            if (signature_key !== expectedSignature) {
                console.error('[Payment Notification] Invalid signature');
                return NextResponse.json(
                    { success: false, message: 'Invalid signature' },
                    { status: 401 }
                );
            }
        }

        // Determine payment outcome
        let paymentStatus: 'paid' | 'pending' | 'cancelled' = 'pending';

        if (
            transaction_status === 'capture' ||
            transaction_status === 'settlement'
        ) {
            if (fraud_status === 'accept' || !fraud_status) {
                paymentStatus = 'paid';
            }
        } else if (
            transaction_status === 'cancel' ||
            transaction_status === 'deny' ||
            transaction_status === 'expire'
        ) {
            paymentStatus = 'cancelled';
        }

        console.log(`[Payment Notification] Order ${order_id} → ${paymentStatus}`);

        // TODO: Persist order status to database when a DB is integrated
        // For now, log and acknowledge

        return NextResponse.json({
            success: true,
            order_id,
            status: paymentStatus,
        });
    } catch (error) {
        console.error('[Payment Notification] Error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to process notification' },
            { status: 500 }
        );
    }
}
