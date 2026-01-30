import React, { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Zap, ArrowRight, Lock, Mail } from 'lucide-react';
import TextInput from '@/Components/TextInput'; // Importing your updated component

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => { reset('password'); };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 font-sans selection:bg-indigo-100">
            <Head title="Log in" />

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
                <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
                <p className="text-slate-500 text-sm">Please enter your details to sign in.</p>
            </motion.div>

            {/* THE LOGIN CARD */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-[440px] bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-2xl shadow-slate-200/50"
            >
                {status && (
                    <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 rounded-2xl text-sm font-medium border border-emerald-100 text-center">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-6">
                    {/* EMAIL INPUT */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors z-10" size={18} />
                            <TextInput
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="pl-14" // Extra padding for the Mail icon
                                placeholder="name@company.com"
                                required
                            />
                        </div>
                        {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
                    </div>

                    {/* PASSWORD INPUT */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
                            {canResetPassword && (
                                <Link href={route('password.request')} className="text-xs font-bold text-indigo-600 hover:text-indigo-500">
                                    Forgot?
                                </Link>
                            )}
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors z-10" size={18} />
                            <TextInput
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="pl-14" // Extra padding for the Lock icon
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>}
                    </div>

                    {/* REMEMBER ME */}
                    <div className="flex items-center ml-1">
                        <input
                            type="checkbox"
                            id="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="w-5 h-5 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-all cursor-pointer"
                        />
                        <label htmlFor="remember" className="ms-3 text-sm font-semibold text-slate-600 cursor-pointer select-none">
                            Keep me logged in
                        </label>
                    </div>

                    {/* SUBMIT BUTTON */}
                    <button
                        disabled={processing}
                        className="w-full py-5 bg-indigo-600 text-white rounded-[1.25rem] font-bold text-lg hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-100 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                    >
                        {processing ? 'Signing in...' : 'Sign in to Dashboard'}
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>
            </motion.div>

            {/* FOOTER */}
            <p className="mt-8 text-slate-500 font-medium">
                New here?{' '}
                <Link href={route('register')} className="text-indigo-600 font-bold hover:underline underline-offset-4">
                    Create a free account
                </Link>
            </p>
        </div>
    );
}