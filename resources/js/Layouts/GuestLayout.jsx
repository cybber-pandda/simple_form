import { Link } from '@inertiajs/react';
import { Zap } from 'lucide-react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-[#FDFDFF] px-6 py-12 sm:justify-center relative overflow-hidden font-sans">
            
            {/* Ambient background decorative elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-50/50 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-50/50 blur-[120px] pointer-events-none" />

            {/* Logo */}
            <div className="z-10 transition-all hover:scale-[1.02] duration-300 mb-8">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100">
                        <Zap size={24} fill="currentColor" />
                    </div>
                    <span className="text-3xl font-black tracking-tighter text-slate-900">
                        FormFlow
                    </span>
                </Link>
            </div>

            {/* The Card - Header-free container */}
            <div className="w-full sm:max-w-[480px] bg-white px-10 py-12 shadow-2xl shadow-slate-200/60 rounded-[3rem] border border-slate-100/80 z-10">
                {children}
            </div>
            
            {/* Footer attribution */}
            <p className="mt-12 text-slate-400 text-[10px] font-black tracking-[0.2em] uppercase">
                Powered by FormFlow
            </p>
        </div>
    );
}