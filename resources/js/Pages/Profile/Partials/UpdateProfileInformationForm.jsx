import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;
    const [preview, setPreview] = useState(null);

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            _method: 'patch', // Method spoofing for file uploads
            name: user.name,
            email: user.email,
            avatar_file: null,
        });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setData('avatar_file', file);
        
        // Show a local preview immediately
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        // Use post() instead of patch() because of the file upload
        post(route('profile.update'), {
            forceFormData: true,
            onSuccess: () => setPreview(null), // Clear preview on success
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
                <p className="mt-1 text-sm text-gray-600">
                    Update your account's profile information and avatar.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6" encType="multipart/form-data">
                {/* AVATAR UPLOAD SECTION */}
                <div className="flex items-center gap-6">
                    <div className="relative group">
                        <img 
                            src={preview || user.avatar} 
                            alt="Profile" 
                            className="w-20 h-20 rounded-full object-cover border-2 border-indigo-100 shadow-sm"
                        />
                        <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs cursor-pointer">
                            Change
                        </div>
                    </div>

                    <div>
                        <InputLabel htmlFor="avatar_file" value="Profile Picture" />
                        <input
                            id="avatar_file"
                            type="file"
                            className="mt-1 block w-full text-sm text-slate-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-indigo-50 file:text-indigo-700
                                hover:file:bg-indigo-100"
                            onChange={handleFileChange}
                            accept="image/*"
                        />
                        <InputError className="mt-2" message={errors.avatar_file} />
                    </div>
                </div>

                {/* NAME FIELD */}
                <div>
                    <InputLabel htmlFor="name" value="Name" />
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

                {/* EMAIL FIELD - (Keep your existing logic for Google users) */}
                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        className={`mt-1 block w-full ${user.google_id ? 'bg-slate-50 text-slate-500' : ''}`}
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        disabled={!!user.google_id}
                    />
                    <InputError className="mt-2" message={errors.email} />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save Changes</PrimaryButton>
                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">Saved successfully.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}