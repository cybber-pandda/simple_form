import { useEffect, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Mail, Lock, ShieldCheck, ArrowRight } from 'lucide-react';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';

export default function ResetPassword({ token, email }) {
    // Local state to track if password complexity is met
    const [isPasswordValid, setIsPasswordValid] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
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
        // Final logic guard
        if (isPasswordValid) {
            post(route('password.store'));
        }
    };

    return (
        <GuestLayout>
            <Head title="Reset Password" />

            <div className="mb-8 text-center">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">New Password</h2>
                <p className="text-slate-500 text-sm mt-2 font-medium">
                    Please create a secure password for your account.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                {/* EMAIL (Read-only or pre-filled) */}
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 text-[10px]">Email Address</label>
                    <TextInput
                        type="email"
                        icon={Mail}
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="Email"
                        required
                    />
                </div>

                {/* NEW PASSWORD WITH COMPLEXITY CHECK */}
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 text-[10px]">New Password</label>
                    <TextInput
                        type="password"
                        icon={Lock}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        // This callback updates our button state
                        onValidationChange={setIsPasswordValid} 
                        showStrength={true}
                        placeholder="••••••••"
                        required
                    />
                    {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>}
                </div>

                {/* CONFIRMATION */}
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 text-[10px]">Confirm Password</label>
                    <TextInput
                        type="password"
                        icon={ShieldCheck}
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        placeholder="••••••••"
                        required
                    />
                </div>

                {/* BUTTON: DISABLED UNLESS VALID */}
                <button
                    disabled={processing || !isPasswordValid}
                    className="w-full mt-4 py-5 bg-indigo-600 text-white rounded-[1.25rem] font-bold text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale-[0.5] disabled:cursor-not-allowed"
                >
                    {processing ? 'Resetting...' : 'Update Password'}
                    {!processing && isPasswordValid && <ArrowRight size={20} />}
                </button>
                
                {!isPasswordValid && data.password.length > 0 && (
                    <p className="text-center text-[10px] font-bold text-amber-500 uppercase tracking-tighter italic">
                        Complete security requirements to enable button
                    </p>
                )}
            </form>
        </GuestLayout>
    );
}