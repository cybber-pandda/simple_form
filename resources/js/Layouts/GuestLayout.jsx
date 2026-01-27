import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        // 1. Background: A soft gradient to give the page depth
        <div className="flex min-h-screen flex-col items-center bg-slate-50 pt-6 sm:justify-center sm:pt-0 relative overflow-hidden">
            
            {/* 2. Ambient background decorative element */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-50/50 blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-50/50 blur-[120px]" />

            <div className="z-10 transition-transform hover:scale-105">
                <Link href="/">
                    <ApplicationLogo className="h-24 w-24" />
                </Link>
            </div>

            {/* 3. The Card: Using our signature 3xl rounding and a deeper shadow */}
            <div className="mt-8 w-full overflow-hidden bg-white px-8 py-10 shadow-2xl shadow-slate-200/50 sm:max-w-md rounded-[2.5rem] border border-slate-100 z-10">
                <div className="mb-8 text-center">
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Welcome back</h2>
                    <p className="text-slate-400 text-sm mt-2 font-medium">Please enter your details to continue.</p>
                </div>

                {children}
            </div>
            
            {/* 4. Footer attribution */}
            <p className="mt-8 text-slate-400 text-xs font-bold tracking-widest uppercase">
                Powered by FormFlow
            </p>
        </div>
    );
}