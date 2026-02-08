import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Mail, Shield } from 'lucide-react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;
    const [preview, setPreview] = useState(null);

    // Logic: Identify Auth Type
    const isGoogleUser = !!user.google_id;

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            _method: 'patch',
            name: user.name,
            email: user.email,
            avatar_file: null,
        });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setData('avatar_file', file);
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('profile.update'), {
            forceFormData: true,
            onSuccess: () => setPreview(null),
        });
    };

    return (
        <section className={className}>
            <header className="flex justify-between items-start">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">Profile Information</h2>
                    <p className="mt-1 text-sm text-slate-500 font-medium">
                        Update your account's public profile and avatar.
                    </p>
                </div>
                
                {/* AUTH METHOD INDICATOR */}
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-tight ${
                    isGoogleUser ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}>
                    <Shield size={12} />
                    {isGoogleUser ? 'Google Account' : 'Standard Login'}
                </div>
            </header>

            <form onSubmit={submit} className="mt-8 space-y-6" encType="multipart/form-data">
                {/* AVATAR UPLOAD SECTION */}
                <div className="flex items-center gap-6 p-4 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                    <div className="relative group">
                        <img 
                            src={preview || user.avatar} 
                            alt="Profile" 
                            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-sm"
                        />
                        <label htmlFor="avatar_file" className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold cursor-pointer">
                            CHANGE
                        </label>
                    </div>

                    <div className="flex-1">
                        <InputLabel htmlFor="avatar_file" value="Profile Picture" className="text-slate-500" />
                        <input
                            id="avatar_file"
                            type="file"
                            className="mt-1 block w-full text-xs text-slate-400
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-[10px] file:font-bold
                                file:bg-indigo-600 file:text-white
                                hover:file:bg-indigo-700 transition-all"
                            onChange={handleFileChange}
                            accept="image/*"
                        />
                        <InputError className="mt-2" message={errors.avatar_file} />
                    </div>
                </div>

                {/* NAME FIELD */}
                <div>
                    <InputLabel htmlFor="name" value="Display Name" />
                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        autoComplete="name"
                    />
                    <InputError className="mt-2" message={errors.name} />
                </div>

                {/* EMAIL FIELD - LOCKED FOR ALL */}
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <InputLabel htmlFor="email" value="Email Address" />
                        <span className="text-[10px] font-bold text-slate-400 italic">Primary Identifier</span>
                    </div>
                    <div className="relative">
                        <TextInput
                            id="email"
                            type="email"
                            className="block w-full bg-slate-50 text-slate-500 cursor-not-allowed border-dashed"
                            value={data.email}
                            disabled
                            required
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-300">
                            <Mail size={16} />
                        </div>
                    </div>
                    <p className="mt-2 text-[11px] text-slate-400 leading-relaxed font-medium">
                        Email addresses are permanent. To change your login email, please contact support.
                    </p>
                    <InputError className="mt-2" message={errors.email} />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing} className="rounded-xl px-6">
                        Save Changes
                    </PrimaryButton>
                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0 translate-x-1"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm font-bold text-emerald-600">Profile Updated!</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}