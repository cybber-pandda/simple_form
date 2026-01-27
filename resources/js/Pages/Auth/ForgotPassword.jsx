import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Zap, Mail, ArrowRight, ChevronLeft } from 'lucide-react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 font-sans selection:bg-indigo-100">
            <Head title="Reset Password" />

            {/* BRANDING HEADER */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-10"
            >
                <Link href="/" className="inline-flex items-center gap-3 mb-4 group">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-200 group-hover:rotate-12 transition-transform duration-300">
                        <Zap size={24} fill="currentColor" />
                    </div>
                    <span className="text-3xl font-black tracking-tighter text-slate-900">FormFlow</span>
                </Link>
                <h2 className="text-2xl font-bold text-slate-900">Password Recovery</h2>
                <p className="text-slate-500 text-sm max-w-[300px] mx-auto mt-2">
                    Enter your email and we'll send you a link to reset your password.
                </p>
            </motion.div>

            {/* THE CARD */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-[440px] bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-2xl shadow-slate-200/50"
            >
                {/* SUCCESS STATUS MESSAGE */}
                {status && (
                    <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 rounded-2xl text-sm font-medium border border-emerald-100 text-center animate-pulse">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-6">
                    {/* EMAIL INPUT */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none ring-1 ring-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all outline-none text-slate-700"
                                placeholder="name@company.com"
                                required
                                autoFocus
                            />
                        </div>
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>
                        )}
                    </div>

                    {/* SUBMIT BUTTON */}
                    <button
                        disabled={processing}
                        className="w-full py-5 bg-indigo-600 text-white rounded-[1.25rem] font-bold text-lg hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-100 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                    >
                        {processing ? 'Sending...' : 'Send Reset Link'}
                        {!processing && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                    </button>
                </form>

                {/* BACK TO LOGIN */}
                <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                    <Link 
                        href={route('login')} 
                        className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                        <ChevronLeft size={16} />
                        Back to Login
                    </Link>
                </div>
            </motion.div>

            {/* SIMPLE FOOTER */}
            <p className="mt-8 text-slate-400 text-xs font-medium">
                Protected by FormFlow Security Cloud
            </p>
        </div>
    );
}