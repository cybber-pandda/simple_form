import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { Lock, ShieldCheck, KeyRound, Info } from 'lucide-react';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();
    const { auth } = usePage().props;
    const user = auth.user;

    // DETERMINING STAGE: Disable 'Current Password' if it's a Google user 
    // who hasn't set a local password yet.
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

        // Extra safety check before submitting
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
                <h2 className="text-lg font-bold text-slate-900">
                    {currentPasswordDisabled ? 'Set Local Password' : 'Update Password'}
                </h2>

                <p className="mt-1 text-sm text-slate-500 font-medium">
                    {currentPasswordDisabled 
                        ? 'Set a password to enable traditional email login alongside Google.' 
                        : 'Ensure your account is using a long, random password to stay secure.'}
                </p>
            </header>

            <form onSubmit={updatePassword} className="mt-6 space-y-6">
                {/* CURRENT PASSWORD */}
                <div className="space-y-1">
                    <div className="flex justify-between items-center">
                        <InputLabel
                            htmlFor="current_password"
                            value="Current Password"
                            className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1"
                        />
                        {currentPasswordDisabled && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-500 uppercase tracking-tighter">
                                <Info size={12} /> Not Required
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
                        className={`mt-1 ${currentPasswordDisabled ? 'bg-slate-50 opacity-60 cursor-not-allowed border-dashed' : ''}`}
                        autoComplete="current-password"
                        disabled={currentPasswordDisabled}
                        placeholder={currentPasswordDisabled ? "Disabled for Google accounts" : "••••••••"}
                    />

                    <InputError
                        message={errors.current_password}
                        className="mt-2 ml-1"
                    />
                </div>

                {/* NEW PASSWORD */}
                <div className="space-y-1">
                    <InputLabel 
                        htmlFor="password" 
                        value="New Password" 
                        className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1"
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

                {/* CONFIRM NEW PASSWORD */}
                <div className="space-y-1">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm Password"
                        className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1"
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

                <div className="flex items-center gap-4 pt-2">
                    <PrimaryButton 
                        disabled={processing || !isPasswordValid}
                        className="px-8 py-3 bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all active:scale-95"
                    >
                        {currentPasswordDisabled ? 'Enable Local Login' : 'Update Password'}
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-300"
                        enterFrom="opacity-0 translate-x-2"
                        leave="transition ease-in-out duration-300"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                            Success! {currentPasswordDisabled ? 'Login enabled.' : 'Password updated.'}
                        </p>
                    </Transition>
                </div>

                {!isPasswordValid && data.password.length > 0 && (
                    <p className="text-[10px] font-bold text-amber-500 uppercase tracking-tight italic animate-pulse">
                        * Please complete all security requirements above to update.
                    </p>
                )}
            </form>
        </section>
    );
}