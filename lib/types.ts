// Core type definitions for the F&B POS system

export type Category = 'All' | 'Food' | 'Drinks' | 'Desserts';

export interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    category: Exclude<Category, 'All'>;
    emoji: string;
    color: string; // gradient color for card background
    popular?: boolean;
}

export interface CartItem extends MenuItem {
    quantity: number;
}

export interface Order {
    id: string;
    items: CartItem[];
    subtotal: number;
    tax: number;
    total: number;
    timestamp: Date;
    status: 'pending' | 'paid' | 'cancelled';
    paymentMethod?: string;
}

export interface MidtransTransactionDetails {
    order_id: string;
    gross_amount: number;
}

export interface MidtransCustomerDetails {
    first_name: string;
    last_name?: string;
    email?: string;
    phone?: string;
}

export interface MidtransItemDetail {
    id: string;
    price: number;
    quantity: number;
    name: string;
}

export interface CheckoutPayload {
    transaction_details: MidtransTransactionDetails;
    item_details: MidtransItemDetail[];
    customer_details?: MidtransCustomerDetails;
}
