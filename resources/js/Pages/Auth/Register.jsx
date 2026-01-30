import React, { useEffect, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Zap, User, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import TextInput from '@/Components/TextInput';

export default function Register() {
    const [isPasswordValid, setIsPasswordValid] = useState(false);

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
        if (isPasswordValid) {
            post(route('register'));
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 font-sans selection:bg-indigo-100">
            <Head title="Create Account" />

            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center text-center mb-6"
            >
                <Link href="/" className="inline-flex items-center gap-3 mb-4 group">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-200 group-hover:rotate-12 transition-transform duration-300">
                        <Zap size={24} fill="currentColor" />
                    </div>
                    <span className="text-3xl font-black tracking-tighter text-slate-900">FormFlow</span>
                </Link>
                <h2 className="text-2xl font-bold text-slate-900">Get started for free</h2>
                <p className="text-slate-500 text-sm mt-1 font-medium">Join creators building smarter forms today.</p>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-[500px] bg-white border border-slate-200 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl shadow-slate-200/50"
            >
                <form onSubmit={submit} className="space-y-4">
                    
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                        <TextInput
                            icon={User}
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="John Doe"
                            required
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.name}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                        <TextInput
                            icon={Mail}
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="name@company.com"
                            required
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.email}</p>}
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                            <TextInput
                                icon={Lock}
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                onValidationChange={setIsPasswordValid}
                                placeholder="••••••••"
                                required
                                showStrength={true} 
                            />
                        </div>
                        
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
                            <TextInput
                                icon={ShieldCheck}
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {(errors.password || errors.password_confirmation) && (
                        <p className="text-red-500 text-xs ml-1 font-medium">
                            {errors.password || errors.password_confirmation}
                        </p>
                    )}

                    <button
                        disabled={processing || !isPasswordValid}
                        className="w-full mt-2 py-4 bg-indigo-600 text-white rounded-[1.25rem] font-bold text-lg hover:bg-indigo-700 hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:grayscale-[0.5] disabled:cursor-not-allowed"
                    >
                        {processing ? 'Creating account...' : 'Create Account'}
                        {!processing && isPasswordValid && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                    </button>
                    
                    {!isPasswordValid && data.password.length > 0 && (
                        <p className="text-center text-[9px] font-bold text-amber-500 uppercase tracking-tighter italic">
                            Complete security requirements to enable button
                        </p>
                    )}
                </form>

                <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                    <p className="text-sm text-slate-500 font-medium">
                        Already have an account?{' '}
                        <Link href={route('login')} className="text-indigo-600 font-bold hover:underline underline-offset-4">
                            Sign in
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}