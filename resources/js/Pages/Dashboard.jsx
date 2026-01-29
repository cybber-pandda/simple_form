import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import { 
    PlusIcon, 
    LinkIcon, 
    ChatBubbleLeftRightIcon, 
    XMarkIcon, 
    ClipboardIcon, 
    CheckIcon,
    ArrowTopRightOnSquareIcon,
    TrashIcon,
    ExclamationTriangleIcon,
    ShieldCheckIcon
} from '@heroicons/react/24/outline';

export default function Dashboard({ totalForms, activeForms, totalSubmissions, forms = [] }) {
    const { auth } = usePage().props;
    const user = auth.user;
    
    // Verification Logic
    const isApproved = user.verification_status === 'approved';
    const isPendingSubmission = user.verification_status === 'pending' && !user.id_photo_path;
    const isUnderReview = user.verification_status === 'pending' && user.id_photo_path;
    const isRejected = user.verification_status === 'rejected';

    const hasForms = totalForms > 0;
    
    // Modal State
    const [selectedForm, setSelectedForm] = useState(null);
    const [formToDelete, setFormToDelete] = useState(null);
    const [copied, setCopied] = useState(false);

    // Verification Form
    const { data, setData, post, processing, errors } = useForm({
        full_name: '',
        organization: '',
        id_number: '',
        id_photo: null,
    });

    const submitVerification = (e) => {
        e.preventDefault();
        post(route('verification.store'));
    };

    const openLinkModal = (e, form) => {
        e.stopPropagation();
        setSelectedForm(form);
    };

    const copyToClipboard = () => {
        const url = `${window.location.origin}/f/${selectedForm.slug}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const navigateToEdit = (formId) => {
        if (!isApproved) return;
        router.visit(route('forms.edit', formId));
    };

    const confirmDelete = (e, form) => {
        e.stopPropagation();
        setFormToDelete(form);
    };

    const handleDelete = () => {
        if (formToDelete) {
            router.delete(route('forms.destroy', formToDelete.id), {
                onSuccess: () => setFormToDelete(null),
            });
        }
    };

    return (
        <AuthenticatedLayout header="Overview">
            <Head title="Dashboard" />

            {/* Verification Under Review Alert */}
            {isUnderReview && (
                <div className="max-w-7xl mx-auto mt-6 px-4 sm:px-6 lg:px-8">
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3 text-amber-800 shadow-sm">
                        <ShieldCheckIcon className="h-6 w-6 text-amber-500" />
                        <p className="font-semibold">Your verification is currently under review. Access to create forms will be enabled shortly.</p>
                    </div>
                </div>
            )}

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-8">
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                        {[
                            { label: 'Total Submissions', value: totalSubmissions || '0', icon: <ChatBubbleLeftRightIcon className="w-5 h-5 text-blue-500" /> },
                            { label: 'Active Forms', value: activeForms, icon: <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> },
                            { label: 'Total Forms', value: totalForms, icon: null },
                        ].map((stat, i) => (
                            <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                    <p className="mt-2 text-4xl font-black text-slate-900">{stat.value}</p>
                                </div>
                                {stat.icon}
                            </div>
                        ))}
                    </div>

                    {!hasForms ? (
                        <div className="relative overflow-hidden bg-white shadow-2xl shadow-slate-200/50 rounded-[2.5rem] border border-slate-100">
                            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-indigo-50 rounded-full blur-3xl opacity-50" />
                            <div className="relative p-10 sm:p-16 flex flex-col items-center text-center">
                                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-200">
                                    <PlusIcon className="h-8 w-8" />
                                </div>
                                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">Ready to build something great?</h1>
                                <p className="max-w-xl text-lg font-medium text-slate-500 mb-10">
                                    {isApproved ? 'Welcome to FormFlow. Start capturing data with our premium builder.' : 'Verification is required to start creating forms.'}
                                </p>
                                
                                {isApproved ? (
                                    <Link href={route('forms.create')}>
                                        <PrimaryButton>Create Your First Form</PrimaryButton>
                                    </Link>
                                ) : (
                                    <PrimaryButton disabled className="opacity-50 cursor-not-allowed">
                                        Verification Required
                                    </PrimaryButton>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center px-4">
                                <h2 className="text-xl font-black text-slate-900">Your Recent Forms</h2>
                                {isApproved ? (
                                    <Link href={route('forms.create')} className="text-sm font-bold text-indigo-600 hover:text-indigo-700">
                                        + Create New
                                    </Link>
                                ) : (
                                    <span className="text-sm font-bold text-slate-400 cursor-not-allowed">Verification Required</span>
                                )}
                            </div>
                            
                            <div className="grid grid-cols-1 gap-4">
                                {forms.map((form) => (
                                    <div 
                                        key={form.id} 
                                        onClick={() => navigateToEdit(form.id)}
                                        className={`group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4 transition-all relative ${isApproved ? 'hover:border-indigo-300 hover:shadow-md cursor-pointer' : 'opacity-75 cursor-default'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{form.title}</h3>
                                                <p className="text-xs text-slate-400 font-medium">Created {new Date(form.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                            <Link 
                                                href={route('forms.submissions', form.id)} 
                                                onClick={(e) => e.stopPropagation()} 
                                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-100 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition-all shadow-sm z-10"
                                            >
                                                <ChatBubbleLeftRightIcon className="w-4 h-4" />
                                                {form.submissions_count || 0} Submissions
                                            </Link>

                                            <button 
                                                onClick={(e) => openLinkModal(e, form)} 
                                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200 z-10"
                                            >
                                                <LinkIcon className="w-4 h-4" />
                                                Get Share Link
                                            </button>

                                            <button 
                                                onClick={(e) => confirmDelete(e, form)} 
                                                className="p-2.5 bg-white border border-slate-100 text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all z-10"
                                                title="Delete Form"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* MANDATORY VERIFICATION MODAL */}
            {(isPendingSubmission || isRejected) && (
                <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-[200] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] p-10 max-w-xl w-full shadow-2xl relative border border-white/20">
                        <div className="mb-8 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white">
                                <ShieldCheckIcon className="h-10 w-10" />
                            </div>
                            <h3 className="text-3xl font-black text-slate-900">Creator Verification</h3>
                            <p className="text-slate-500 font-medium mt-2">
                                {isRejected 
                                    ? "Your previous application was rejected. Please update your details." 
                                    : "To ensure community safety, we require identity verification before you can create forms."}
                            </p>
                        </div>

                        <form onSubmit={submitVerification} className="space-y-5">
                            <div>
                                <InputLabel htmlFor="full_name" value="Full Legal Name" />
                                <TextInput
                                    id="full_name"
                                    className="mt-1 block w-full"
                                    value={data.full_name}
                                    onChange={(e) => setData('full_name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.full_name} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="organization" value="Organization Name" />
                                <TextInput
                                    id="organization"
                                    className="mt-1 block w-full"
                                    value={data.organization}
                                    onChange={(e) => setData('organization', e.target.value)}
                                    required
                                />
                                <InputError message={errors.organization} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="id_photo" value="Upload ID Photo (Passport/Driver's License)" />
                                <input
                                    type="file"
                                    className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                    onChange={(e) => setData('id_photo', e.target.files[0])}
                                    required
                                />
                                <InputError message={errors.id_photo} className="mt-2" />
                            </div>

                            <PrimaryButton className="w-full justify-center py-4 text-lg" disabled={processing}>
                                {processing ? 'Submitting...' : 'Submit for Review'}
                            </PrimaryButton>
                        </form>
                    </div>
                </div>
            )}
            
            {/* Share Link Modal */}
            {selectedForm && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] p-8 max-w-lg w-full shadow-2xl relative border border-white/20">
                        <button 
                            onClick={() => setSelectedForm(null)}
                            className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>

                        <div className="mb-6">
                            <h3 className="text-2xl font-black text-slate-800">Share Form</h3>
                            <p className="text-slate-500 font-medium text-sm mt-1">Copy the link below to start collecting responses.</p>
                        </div>
                        
                        <div className="flex items-center gap-2 bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6">
                            <input 
                                readOnly 
                                value={`${window.location.origin}/f/${selectedForm.slug}`} 
                                className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium text-indigo-600 truncate"
                            />
                            <button 
                                onClick={copyToClipboard}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                                    copied ? 'bg-emerald-500 text-white' : 'bg-white text-slate-700 shadow-sm hover:bg-slate-50'
                                }`}
                            >
                                {copied ? <CheckIcon className="w-4 h-4" /> : <ClipboardIcon className="w-4 h-4" />}
                                {copied ? 'Copied' : 'Copy'}
                            </button>
                        </div>

                        <div className="flex gap-3">
                            <a 
                                href={route('forms.show', selectedForm.slug)} 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 flex items-center justify-center gap-2 py-4 bg-slate-100 text-slate-700 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                            >
                                <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                                Open Form
                            </a>
                            <button 
                                onClick={() => setSelectedForm(null)}
                                className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {formToDelete && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl relative border border-white/20">
                        <div className="flex flex-col items-center text-center">
                            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                                <ExclamationTriangleIcon className="h-8 w-8" />
                            </div>
                            
                            <h3 className="text-2xl font-black text-slate-900 mb-2">Delete Form?</h3>
                            <p className="text-slate-500 font-medium mb-8">
                                Are you sure you want to delete <span className="font-bold text-slate-800">"{formToDelete.title}"</span>? 
                                This action cannot be undone and all submissions will be lost.
                            </p>

                            <div className="flex w-full gap-3">
                                <button 
                                    onClick={() => setFormToDelete(null)}
                                    className="flex-1 py-4 bg-slate-100 text-slate-700 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleDelete}
                                    className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-100"
                                >
                                    Yes, Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}