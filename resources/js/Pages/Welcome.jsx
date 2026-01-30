import React from 'react';
import { Link, Head } from '@inertiajs/react';
import { 
  PlusCircle, 
  Settings2, 
  ShieldCheck, 
  BarChart3, 
  ArrowRight,
  Link as LinkIcon,
  Zap,
  Globe
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Welcome({ auth, canLogin, canRegister }) {
    return (
        <>
            <Head title="Welcome to FormFlow" />
            
            <div className="min-h-screen bg-[#FDFDFF] text-slate-900 font-sans selection:bg-indigo-100">
                {/* --- NAVIGATION --- */}
                <nav className="flex items-center justify-between px-4 sm:px-8 py-6 max-w-7xl mx-auto">
                    <div className="flex items-center gap-2 font-bold text-xl sm:text-2xl tracking-tight text-indigo-600">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                            <Zap size={18} fill="currentColor" />
                        </div>
                        <span>FormFlow</span>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-3">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="px-4 py-2 sm:px-6 sm:py-2.5 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all shadow-md text-sm sm:base"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                {canLogin && (
                                    <Link
                                        href={route('login')}
                                        className="px-3 py-2 sm:px-5 sm:py-2.5 text-slate-600 font-semibold hover:text-indigo-600 transition-colors text-sm sm:base"
                                    >
                                        Log in
                                    </Link>
                                )}
                                {canRegister && (
                                    <Link
                                        href={route('register')}
                                        className="px-4 py-2 sm:px-6 sm:py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 text-sm sm:base"
                                    >
                                        Register
                                    </Link>
                                )}
                            </>
                        )}
                    </div>
                </nav>

                {/* --- HERO SECTION --- */}
                <header className="max-w-5xl mx-auto pt-10 md:pt-16 pb-20 px-6 text-center">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-950 mb-8 leading-[1.1]">
                            The modern way to <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">capture data.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-500 mb-10 leading-relaxed max-w-2xl mx-auto">
                            Whether you're a creator building a quick poll or an admin managing thousands of responses, FormFlow makes it effortless.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link
                                href={auth.user ? route('dashboard') : route('register')}
                                className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:scale-[1.03] active:scale-[0.97] transition-all shadow-2xl shadow-indigo-200 flex items-center justify-center gap-3"
                            >
                                Start Building for Free <ArrowRight size={20} />
                            </Link>
                        </div>
                    </motion.div>
                </header>

                {/* --- BENTO GRID --- */}
                <section className="max-w-7xl mx-auto px-6 pb-32">
                    {/* Changed auto-rows to only apply on medium screens to prevent content cut-off on mobile */}
                    <div className="grid grid-cols-1 md:grid-cols-6 md:grid-rows-2 gap-4 md:auto-rows-[240px]">
                        
                        {/* FEATURE 1: CREATOR STUDIO */}
                        <div className="md:col-span-3 md:row-span-2 bg-white border border-slate-200 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-12 flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all group overflow-hidden relative">
                            <div className="relative z-10">
                                <div className="w-14 h-14 md:w-16 md:h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                                    <Settings2 size={32} />
                                </div>
                                <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 md:mb-6">Creator Studio</h3>
                                <p className="text-slate-500 text-base md:text-lg leading-relaxed max-w-sm">
                                    Create and customize forms with a sleek interface. Manage your questions, brand your theme, and organize your dashboard.
                                </p>
                            </div>
                            <div className="relative z-10 mt-8 flex flex-wrap gap-2">
                                <span className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-xs md:text-sm font-medium text-slate-600">Drag & Drop</span>
                                <span className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-xs md:text-sm font-medium text-slate-600">Custom Branding</span>
                            </div>
                            {/* Decorative background circle */}
                            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50 group-hover:bg-indigo-100 transition-colors" />
                        </div>

                        {/* FEATURE 2: INSTANT URL */}
                        <div className="md:col-span-3 bg-indigo-600 text-white rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 flex items-center gap-8 shadow-xl relative overflow-hidden group">
                            <div className="flex-1 relative z-10">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                                    <Globe size={24} />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Share via URL</h3>
                                <p className="text-indigo-100 text-sm leading-relaxed">
                                    Your forms are live instantly. Send a custom link to your audience and collect responses anywhere in the world.
                                </p>
                            </div>
                            <div className="hidden lg:block flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-2 h-2 rounded-full bg-red-400" />
                                    <div className="w-2 h-2 rounded-full bg-yellow-400" />
                                    <div className="w-2 h-2 rounded-full bg-green-400" />
                                </div>
                                <div className="text-[10px] font-mono text-indigo-200">
                                    https://formflow.io/s/my-form
                                </div>
                            </div>
                        </div>

                        {/* FEATURE 3: SUPER ADMIN */}
                        <div className="md:col-span-2 bg-slate-900 text-white rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 flex flex-col justify-between hover:scale-[0.98] transition-transform shadow-2xl">
                            <div>
                                <ShieldCheck className="text-indigo-400 mb-4" size={32} />
                                <h3 className="text-2xl font-bold mb-2">Super Admin</h3>
                                <p className="text-slate-400 text-sm">
                                    Full visibility. Access, manage, and moderate every form created in the system.
                                </p>
                            </div>
                        </div>

                        {/* FEATURE 4: ANALYTICS */}
                        <div className="md:col-span-1 bg-white border border-slate-200 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 flex flex-col items-center justify-center hover:bg-indigo-50 transition-colors shadow-sm">
                            <BarChart3 className="text-indigo-600 mb-4" size={40} />
                            <h3 className="text-lg font-bold">Metrics</h3>
                            <p className="text-slate-400 text-[10px] text-center mt-1 uppercase tracking-widest">Global Insights</p>
                        </div>

                    </div>
                </section>
            </div>
        </>
    );
}