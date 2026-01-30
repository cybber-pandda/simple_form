import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                        Profile
                    </h2>
                    
                    {/* Navigation button placed directly beside the Profile title */}
                    <Link
                        href={route('dashboard')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 text-[11px] font-bold rounded-xl hover:bg-slate-200 transition-all active:scale-95"
                    >
                        <ArrowLeftIcon className="w-3.5 h-3.5" />
                        Back to Portal
                    </Link>
                </div>
            }
        >
            <Head title="Profile Settings" />

            <div className="py-12 bg-slate-50/30 min-h-screen">
                {/* Max-width container to keep the forms from stretching too far without a sidebar */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    
                    {/* Profile Information Card */}
                    <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-slate-100 shadow-sm">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                        />
                    </div>

                    {/* Update Password Card */}
                    <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-slate-100 shadow-sm">
                        <header className="mb-8">
                            <h3 className="text-xl font-black text-slate-900">Security</h3>
                            <p className="text-sm text-slate-500 font-medium">Manage your password and account security settings.</p>
                        </header>
                        <UpdatePasswordForm />
                    </div>

                    {/* Danger Zone Card */}
                    <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-red-50 shadow-sm">
                        <header className="mb-8">
                            <h3 className="text-lg font-bold text-red-600 uppercase text-[10px] tracking-[0.2em]">Danger Zone</h3>
                            <h4 className="text-xl font-black text-slate-900 mt-1">Delete Account</h4>
                            <p className="text-sm text-slate-500 font-medium mt-1">
                                Permanent action. All data associated with this account will be wiped.
                            </p>
                        </header>
                        <DeleteUserForm />
                    </div>
                    
                </div>
            </div>
        </AuthenticatedLayout>
    );
}