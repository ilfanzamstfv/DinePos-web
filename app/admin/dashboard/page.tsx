'use client';

import {
  CircleDollarSign,
  LogOut,
  Package,
  ReceiptText,
  ShieldCheck,
  TrendingUp,
  Users,
  Wallet
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const kpiCards = [
  {
    title: 'Pendapatan Hari Ini',
    value: 'Rp 8.450.000',
    delta: '+12.4% vs kemarin',
    icon: CircleDollarSign,
  },
  {
    title: 'Total Pesanan',
    value: '126',
    delta: '+9 order 1 jam terakhir',
    icon: ReceiptText,
  },
  {
    title: 'Produk Stok Rendah',
    value: '7 item',
    delta: 'Butuh restock hari ini',
    icon: Package,
  },
  {
    title: 'User Aktif',
    value: '14 akun',
    delta: '2 menunggu approval',
    icon: Users,
  },
];

const managementMenus = [
  {
    title: 'Kelola Menu & Stok',
    description: 'Tambah menu baru, update harga, dan kontrol stok per item.',
    icon: Package,
    href: '#',
  },
  {
    title: 'Kelola User',
    description: 'Buat akun kasir/admin baru dan aktivasi nonaktifkan akun.',
    icon: Users,
    href: '#',
  },
  {
    title: 'Permission & Role',
    description: 'Atur hak akses tiap user berdasarkan modul operasional.',
    icon: ShieldCheck,
    href: '#',
  },
  {
    title: 'Pengaturan Pajak',
    description: 'Atur persentase pajak dan simulasi dampak ke total transaksi.',
    icon: Wallet,
    href: '#',
  },
  {
    title: 'Laporan Keuangan',
    description: 'Pantau omzet, laba kotor, dan performa per periode.',
    icon: TrendingUp,
    href: '#',
  },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  return (
    <main className="min-h-screen bg-[#F5F5F0]">
      <section className="border-b border-stone-200/80 bg-gradient-to-br from-[#edf2ee] via-[#f4f7f1] to-[#f7f5ef]">
        <div className="mx-auto max-w-screen-2xl px-4 py-7 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5D866C]">
                Super Admin Dashboard
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-stone-800 sm:text-3xl">
                Control Center DinePos
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-stone-600">
                Mockup dashboard untuk mengelola menu, user, permission, pajak, dan laporan
                keuangan.
              </p>
            </div>
            <button className='inline-flex items-center gap-2 rounded-xl border border-red-300 bg-red-500 px-3 py-2 text-sm font-semibold text-white transition hover:shadow-md active:scale-95'
              onClick={() => router.push('/auth')}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-screen-2xl px-4 py-6 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpiCards.map((card) => {
            const Icon = card.icon;
            return (
              <article
                key={card.title}
                className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                      {card.title}
                    </p>
                    <p className="mt-2 text-2xl font-bold text-stone-800">{card.value}</p>
                  </div>
                  <div className="rounded-xl bg-[#5D866C]/10 p-2 text-[#5D866C]">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-3 text-xs text-stone-500">{card.delta}</p>
              </article>
            );
          })}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-stone-800">Modul Manajemen</h2>
              <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600">
                Prioritas Implementasi
              </span>
            </div>

            <div className="space-y-3">
              {managementMenus.map((menu) => {
                const Icon = menu.icon;
                return (
                  <Link
                    key={menu.title}
                    href={menu.href}
                    className="group flex items-start gap-3 rounded-xl border border-stone-200 p-3 transition hover:border-[#5D866C]/40 hover:bg-[#f8fbf9]"
                  >
                    <div className="rounded-lg bg-stone-100 p-2 text-stone-600 transition group-hover:bg-[#5D866C]/10 group-hover:text-[#5D866C]">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-stone-800">{menu.title}</p>
                      <p className="mt-1 text-xs text-stone-500">{menu.description}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          <aside className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-stone-800">Aktivitas Terbaru</h2>
            <div className="mt-4 space-y-3">
              <div className="rounded-xl bg-stone-50 p-3">
                <p className="text-sm font-semibold text-stone-700">Restock Bahan Baku</p>
                <p className="mt-1 text-xs text-stone-500">09:12 - Stok ayam ditambah 25 kg.</p>
              </div>
              <div className="rounded-xl bg-stone-50 p-3">
                <p className="text-sm font-semibold text-stone-700">Perubahan Pajak</p>
                <p className="mt-1 text-xs text-stone-500">
                  08:45 - Simulasi PPN dari 10% ke 11%.
                </p>
              </div>
              <div className="rounded-xl bg-stone-50 p-3">
                <p className="text-sm font-semibold text-stone-700">Akun Baru Dibuat</p>
                <p className="mt-1 text-xs text-stone-500">
                  08:15 - User kasir cabang Selatan ditambahkan.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
