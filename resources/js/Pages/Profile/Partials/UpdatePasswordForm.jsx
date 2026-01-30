import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { Lock, ShieldCheck, KeyRound } from 'lucide-react';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();
    
    // Track if the new password meets complexity requirements
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
                    Update Password
                </h2>

                <p className="mt-1 text-sm text-slate-500 font-medium">
                    Ensure your account is using a long, random password to stay secure.
                </p>
            </header>

            <form onSubmit={updatePassword} className="mt-6 space-y-6">
                {/* CURRENT PASSWORD */}
                <div className="space-y-1">
                    <InputLabel
                        htmlFor="current_password"
                        value="Current Password"
                        className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1"
                    />

                    <TextInput
                        id="current_password"
                        ref={currentPasswordInput}
                        icon={KeyRound}
                        value={data.current_password}
                        onChange={(e) =>
                            setData('current_password', e.target.value)
                        }
                        type="password"
                        className="mt-1"
                        autoComplete="current-password"
                        placeholder="Current Password"
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
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
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
                        Update Password
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-300"
                        enterFrom="opacity-0 translate-x-2"
                        leave="transition ease-in-out duration-300"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                            Success! Your password is updated.
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