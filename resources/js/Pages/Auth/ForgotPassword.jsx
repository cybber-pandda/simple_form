import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, ArrowRight, ChevronLeft } from 'lucide-react';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <div className="mb-8 text-center">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Recovery</h2>
                <p className="text-slate-500 text-sm mt-2 font-medium">
                    Enter your email to receive a reset link.
                </p>
            </div>

            {status && (
                <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 rounded-2xl text-sm font-bold border border-emerald-100 text-center animate-in fade-in zoom-in-95 duration-300">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
                    <TextInput
                        type="email"
                        icon={Mail}
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="name@company.com"
                        required
                        autoFocus
                    />
                    {errors.email && (
                        <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.email}</p>
                    )}
                </div>

                <button
                    disabled={processing}
                    className="w-full py-5 bg-indigo-600 text-white rounded-[1.25rem] font-bold text-lg hover:bg-indigo-700 hover:shadow-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {processing ? 'Sending...' : 'Send Reset Link'}
                    {!processing && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                </button>
            </form>

            <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                <Link 
                    href={route('login')} 
                    className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors"
                >
                    <ChevronLeft size={16} />
                    Back to Login
                </Link>
            </div>
        </GuestLayout>
    );
}