import React, { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Zap, User, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 font-sans selection:bg-indigo-100">
            <Head title="Create Account" />

            {/* BRANDING HEADER */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
            >
                <Link href="/" className="inline-flex items-center gap-3 mb-4 group">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-200 group-hover:rotate-12 transition-transform duration-300">
                        <Zap size={24} fill="currentColor" />
                    </div>
                    <span className="text-3xl font-black tracking-tighter text-slate-900">FormFlow</span>
                </Link>
                <h2 className="text-2xl font-bold text-slate-900">Get started for free</h2>
                <p className="text-slate-500 text-sm mt-1">Join creators building smarter forms today.</p>
            </motion.div>

            {/* THE REGISTRATION CARD */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-[480px] bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-2xl shadow-slate-200/50"
            >
                <form onSubmit={submit} className="space-y-5">
                    
                    {/* FULL NAME */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none ring-1 ring-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all outline-none text-slate-700"
                                placeholder="John Doe"
                                required
                            />
                        </div>
                        {errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name}</p>}
                    </div>

                    {/* EMAIL */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none ring-1 ring-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all outline-none text-slate-700"
                                placeholder="name@company.com"
                                required
                            />
                        </div>
                        {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
                    </div>

                    {/* PASSWORD GRID */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none ring-1 ring-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all outline-none text-slate-700 placeholder:text-slate-300"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Confirm</label>
                            <div className="relative group">
                                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                <input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none ring-1 ring-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all outline-none text-slate-700 placeholder:text-slate-300"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    {(errors.password || errors.password_confirmation) && (
                        <p className="text-red-500 text-xs ml-1">
                            {errors.password || errors.password_confirmation}
                        </p>
                    )}

                    {/* SUBMIT BUTTON */}
                    <button
                        disabled={processing}
                        className="w-full mt-4 py-5 bg-indigo-600 text-white rounded-[1.25rem] font-bold text-lg hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-100 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                    >
                        {processing ? 'Creating account...' : 'Create Account'}
                        {!processing && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                    </button>
                </form>

                {/* LOGIN REDIRECT */}
                <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                    <p className="text-sm text-slate-500 font-medium">
                        Already have an account?{' '}
                        <Link 
                            href={route('login')} 
                            className="text-indigo-600 font-bold hover:underline underline-offset-4"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </motion.div>

            {/* SIMPLE FOOTER */}
            <p className="mt-8 text-slate-400 text-xs font-medium">
                By signing up, you agree to our Terms of Service.
            </p>
        </div>
    );
}