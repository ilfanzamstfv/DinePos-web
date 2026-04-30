'use client';
import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { ChefHat, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
type ToastType = 'Success' | 'Error';
export default function AuthPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [toast, setToast] = useState<{
        show: boolean;
        type: ToastType;
        text: string;
    }>({ show: false, type: 'Success', text: '' });

    const showToast = (type: ToastType, text: string) => {
        setToast({ show: true, type, text });
    };
    useEffect(() => {
        if (!toast.show) return;
        const timer = setTimeout(() => {
            setToast((prev) => ({ ...prev, show: false }));
        }, 2500);
        return () => clearTimeout(timer);
    }, [toast.show]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !password.trim()) {
            showToast('Error', 'Email dan password wajib diisi.');
            return;
        }
        // Frontend static dulu, role implicit = super_admin
        showToast('Success', 'Login berhasil sebagai Super Admin.');
    };
    return (
        <main className="min-h-screen bg-[#F5F5F0] px-4 py-10">
            {toast.show && (
                <div className={`fixed right-4 top-4 z-[9999] transition-all duration-300 ease-out ${toast.show
                    ? 'translate-y-0 translate-x-0 opacity-100'
                    : '-translate-y-2 translate-x-3 opacity-0 pointer-events-none'
                    }`}>
                    <div
                        className={`flex min-w-[280px] items-center gap-2 rounded-xl px-3 py-4 text-sm shadow-lg ${toast.type === 'Success'
                            ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                            : 'border border-red-200 bg-red-50 text-red-700'
                            }`}
                    >
                        {toast.type === 'Success' ? (
                            <CheckCircle2 className="h-4 w-4" />
                        ) : (
                            <AlertCircle className="h-4 w-4" />
                        )}
                        <span>{toast.text}</span>
                    </div>
                </div>
            )}
            <div className="mx-auto w-full max-w-md">
                <Link
                    href="/"
                    className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-[#5D866C]"
                >
                    <ChefHat className="h-4 w-4" />
                    Kembali ke kasir
                </Link>
                <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                    <div className="mb-5 flex items-center gap-2 justify-center">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#5D866C]">
                            <ChefHat className="h-5 w-5 text-white" />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <h1 className="text-lg font-bold leading-none tracking-tight text-stone-800">
                                DinePos
                            </h1>
                            <p className="text-xs font-medium leading-none text-[#5D866C]">
                                Modern F&amp;B POS
                            </p>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-stone-600">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-[#5D866C] focus:ring-2 focus:ring-[#5D866C]/20"
                                placeholder="admin@dinepos.com"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-stone-600">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={8}
                                className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-[#5D866C] focus:ring-2 focus:ring-[#5D866C]/20"
                                placeholder="Minimal 8 karakter"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full rounded-xl bg-[#5D866C] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4a6e58]"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}