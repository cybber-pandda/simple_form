import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { Lock, ShieldCheck, KeyRound, Info, Globe, CheckCircle2 } from 'lucide-react';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();
    
    // Access user data from Inertia page props
    const { auth } = usePage().props;
    const user = auth.user;

    /**
     * LOGIC: 
     * 1. isGoogleUser: User linked via Google OAuth.
     * 2. hasSetPassword: User has a local password (from your database/migration).
     * 3. currentPasswordDisabled: If they are Google users but haven't created 
     * a local password yet, they can't provide a "current" one.
     */
    const isGoogleUser = !!user.google_id;
    const hasSetPassword = !!user.has_password; 
    const currentPasswordDisabled = isGoogleUser && !hasSetPassword;

    const [isPasswordValid, setIsPasswordValid] = useState(false);

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        if (!isPasswordValid) return;

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={`max-w-xl ${className}`}>
            <header>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h2 className="text-lg font-black text-slate-900">
                        {currentPasswordDisabled ? 'Set Account Password' : 'Security Settings'}
                    </h2>
                    
                    {/* AUTHENTICATION METHOD INDICATORS */}
                    <div className="flex gap-1.5">
                        {isGoogleUser && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 border border-blue-100 text-[9px] font-black uppercase tracking-wider">
                                <Globe size={10} /> Google Linked
                            </span>
                        )}
                        {hasSetPassword ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100 text-[9px] font-black uppercase tracking-wider">
                                <CheckCircle2 size={10} /> Password Active
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-600 border border-amber-100 text-[9px] font-black uppercase tracking-wider">
                                <Info size={10} /> Password Not Set
                            </span>
                        )}
                    </div>
                </div>

                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    {currentPasswordDisabled 
                        ? 'Create a password to enable logging in directly with your email address.' 
                        : 'Keep your account secure by using a strong, unique password.'}
                </p>
            </header>

            <form onSubmit={updatePassword} className="mt-8 space-y-6">
                {/* CURRENT PASSWORD SECTION */}
                <div className="space-y-1">
                    <div className="flex justify-between items-center">
                        <InputLabel
                            htmlFor="current_password"
                            value="Current Password"
                            className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1"
                        />
                        {currentPasswordDisabled && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-500 uppercase italic">
                                Bypass: Social Auth Active
                            </span>
                        )}
                    </div>

                    <TextInput
                        id="current_password"
                        ref={currentPasswordInput}
                        icon={KeyRound}
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        type="password"
                        className={`mt-1 transition-all ${
                            currentPasswordDisabled 
                            ? 'bg-slate-50 opacity-70 cursor-not-allowed border-dashed grayscale' 
                            : ''
                        }`}
                        autoComplete="current-password"
                        disabled={currentPasswordDisabled}
                        placeholder={currentPasswordDisabled ? "Not required for Google login" : "••••••••"}
                    />

                    <InputError
                        message={errors.current_password}
                        className="mt-2 ml-1"
                    />
                </div>

                {/* NEW PASSWORD SECTION */}
                <div className="space-y-1">
                    <InputLabel 
                        htmlFor="password" 
                        value="New Password" 
                        className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1"
                    />

                    <TextInput
                        id="password"
                        ref={passwordInput}
                        icon={Lock}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        onValidationChange={setIsPasswordValid}
                        type="password"
                        className="mt-1"
                        autoComplete="new-password"
                        showStrength={true}
                        placeholder="••••••••"
                    />

                    <InputError message={errors.password} className="mt-2 ml-1" />
                </div>

                {/* CONFIRM PASSWORD SECTION */}
                <div className="space-y-1">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm New Password"
                        className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1"
                    />

                    <TextInput
                        id="password_confirmation"
                        icon={ShieldCheck}
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        type="password"
                        className="mt-1"
                        autoComplete="new-password"
                        placeholder="••••••••"
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2 ml-1"
                    />
                </div>

                {/* FORM ACTIONS */}
                <div className="flex items-center gap-4 pt-4">
                    <PrimaryButton 
                        disabled={processing || !isPasswordValid}
                        className="px-8 py-3 bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:opacity-40 transition-all active:scale-95"
                    >
                        {currentPasswordDisabled ? 'Enable Password Login' : 'Update Password'}
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-out duration-300"
                        enterFrom="opacity-0 translate-x-4"
                        leave="transition ease-in duration-300"
                        leaveTo="opacity-0"
                    >
                        <p className="flex items-center gap-2 text-sm font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
                            <CheckCircle2 size={16} />
                            {currentPasswordDisabled ? 'Access Enabled!' : 'Security Updated!'}
                        </p>
                    </Transition>
                </div>

                {/* VALIDATION HINT */}
                {!isPasswordValid && data.password.length > 0 && (
                    <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg border border-amber-100">
                        <Info size={14} className="text-amber-500" />
                        <p className="text-[10px] font-bold text-amber-700 uppercase tracking-tight italic">
                            Password must meet all security requirements to continue.
                        </p>
                    </div>
                )}
            </form>
        </section>
    );
}