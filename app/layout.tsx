import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import Script from 'next/script';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '600', '700'],
});

export const metadata: Metadata = {
  title: 'DinePos — Modern F&B Point of Sale',
  description:
    'A beautiful, modern Point of Sale system built for F&B businesses. Manage orders, process payments, and generate receipts with ease.',
  keywords: ['POS', 'point of sale', 'restaurant', 'F&B', 'cashier', 'kasir'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <Script
          src="https://app.midtrans.com/snap/snap.js"
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
          strategy='beforeInteractive'
        />
      </head>
      <body className="bg-[#F5F5F0] font-sans antialiased">{children}</body>
    </html>
  );
}
