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
    ShieldCheckIcon,
    ClockIcon,
    ChartBarIcon,
    ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

export default function Dashboard({ totalForms, activeForms, totalSubmissions, forms = [] }) {
    const { auth } = usePage().props;
    const user = auth.user;

    const isApproved = user.verification_status === 'approved';
    const isPendingSubmission = user.verification_status === 'pending' && !user.id_photo_path;
    const isUnderReview = user.verification_status === 'pending' && user.id_photo_path;
    const isRejected = user.verification_status === 'rejected';

    const hasForms = totalForms > 0;

    const [selectedForm, setSelectedForm] = useState(null);
    const [formToDelete, setFormToDelete] = useState(null);
    const [copied, setCopied] = useState(false);

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

            {isUnderReview && (
                <div className="max-w-7xl mx-auto mt-4 px-4 sm:px-6 lg:px-8">
                    <div className="bg-amber-50 border border-amber-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center gap-3 text-amber-800 shadow-sm">
                        <ShieldCheckIcon className="h-5 w-5 sm:h-6 sm:w-6 text-amber-500 shrink-0" />
                        <p className="text-xs sm:text-sm font-semibold leading-snug">Verification is under review. Access will be enabled shortly.</p>
                    </div>
                </div>
            )}

            <div className="py-4 sm:py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-3">
                        {[
                            {
                                label: 'Submissions',
                                value: totalSubmissions || '0',
                                icon: <ChatBubbleLeftRightIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />,
                                href: route('metrics.index') // Replace with your actual route name
                            },
                            {
                                label: 'Active Forms',
                                value: activeForms,
                                icon: <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />,
                                href: route('metrics.index')
                            },
                            {
                                label: 'Total Forms',
                                value: totalForms,
                                icon: <ChartBarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />,
                                href: route('metrics.index')
                            },
                        ].map((stat, i) => (
                            <Link
                                key={i}
                                href={stat.href}
                                className="group relative bg-white p-5 sm:p-8 rounded-2xl sm:rounded-[2rem] border border-slate-100 shadow-sm flex justify-between items-start transition-all hover:border-indigo-300 hover:shadow-md overflow-hidden"
                            >
                                {/* Hover "Expand" Hint */}
                                <div className="absolute inset-x-0 bottom-0 h-1 bg-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />

                                <div className="relative z-10">
                                    <p className="text-[10px] sm:text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        {stat.label}
                                        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500 lowercase font-medium flex items-center">
                                            &rarr; View Details
                                        </span>
                                    </p>
                                    <p className="mt-1 sm:mt-2 text-2xl sm:text-4xl font-black text-slate-900">{stat.value}</p>
                                </div>

                                <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                    {stat.icon}
                                </div>
                            </Link>
                        ))}
                    </div>

                    {!hasForms ? (
                        <div className="relative overflow-hidden bg-white shadow-xl sm:shadow-2xl shadow-slate-200/50 rounded-2xl sm:rounded-[2.5rem] border border-slate-100">
                            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-40 h-40 sm:w-80 sm:h-80 bg-indigo-50 rounded-full blur-3xl opacity-50" />
                            <div className="relative p-8 sm:p-16 flex flex-col items-center text-center">
                                <div className="mb-4 sm:mb-6 inline-flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
                                    <PlusIcon className="h-6 w-6 sm:h-8 sm:w-8" />
                                </div>
                                <h1 className="text-xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2 sm:mb-4">Ready to build?</h1>
                                <p className="max-w-md text-sm sm:text-lg font-medium text-slate-500 mb-6 sm:mb-10 leading-relaxed">
                                    {isApproved ? 'Start capturing data with our premium builder.' : 'Verification is required to start creating forms.'}
                                </p>

                                {isApproved ? (
                                    <Link href={route('forms.create')} className="w-full sm:w-auto">
                                        <PrimaryButton className="w-full justify-center">Create First Form</PrimaryButton>
                                    </Link>
                                ) : (
                                    <PrimaryButton disabled className="opacity-50 cursor-not-allowed w-full sm:w-auto justify-center">
                                        Verification Required
                                    </PrimaryButton>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg sm:text-xl font-black text-slate-900">Recent Forms</h2>
                                {isApproved && (
                                    <Link href={route('forms.create')} className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-700">
                                        + New Form
                                    </Link>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:gap-4">
                                {forms.map((form) => (
                                    <div
                                        key={form.id}
                                        onClick={() => navigateToEdit(form.id)}
                                        className={`group bg-white p-4 sm:p-6 rounded-2xl sm:rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center gap-4 transition-all relative ${isApproved ? 'hover:border-indigo-300 hover:shadow-md cursor-pointer' : 'opacity-75 cursor-default'}`}
                                    >
                                        <div className="flex items-center gap-3 sm:gap-4 flex-1">
                                            <div className="h-10 w-10 sm:h-14 sm:w-14 shrink-0 rounded-xl sm:rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                                                <svg className="w-5 h-5 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                            </div>
                                            <div className="truncate">
                                                <h3 className="font-black text-sm sm:text-lg text-slate-900 group-hover:text-indigo-600 transition-colors truncate">{form.title}</h3>

                                                {/* INJECTED METRICS ROW */}
                                                <div className="flex flex-wrap items-center gap-y-1 gap-x-3 mt-1">
                                                    <div className="flex items-center gap-1 text-[10px] sm:text-xs font-bold text-slate-400">
                                                        <ClockIcon className="w-3 h-3" />
                                                        {new Date(form.created_at).toLocaleDateString()}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-[10px] sm:text-xs font-bold text-emerald-500">
                                                        <ArrowTrendingUpIcon className="w-3 h-3" />
                                                        Active
                                                    </div>
                                                    {form.submissions_count > 0 && (
                                                        <div className="hidden sm:flex items-center gap-1 text-[10px] sm:text-xs font-bold text-indigo-400">
                                                            <ChatBubbleLeftRightIcon className="w-3 h-3" />
                                                            Last entry: {new Date().toLocaleDateString()}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0">
                                            <Link
                                                href={route('forms.submissions', form.id)}
                                                onClick={(e) => e.stopPropagation()}
                                                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white border border-slate-100 text-slate-600 text-[10px] sm:text-xs font-black rounded-xl hover:bg-slate-50 transition-all shadow-sm z-10"
                                            >
                                                <ChatBubbleLeftRightIcon className="w-3.5 h-3.5" />
                                                {form.submissions_count || 0} <span className="sm:inline">Submissions</span>
                                            </Link>

                                            <button
                                                onClick={(e) => openLinkModal(e, form)}
                                                className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-indigo-600 transition-all shadow-md z-10"
                                            >
                                                <LinkIcon className="w-4 h-4" />
                                            </button>

                                            <button
                                                onClick={(e) => confirmDelete(e, form)}
                                                className="p-2.5 bg-white border border-slate-100 text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all z-10"
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

            {/* Verification Modal */}
            {(isPendingSubmission || isRejected) && (
                <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4">
                    <div className="bg-white rounded-t-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 max-w-xl w-full shadow-2xl relative border border-white/20 animate-in slide-in-from-bottom duration-300">
                        <div className="mb-6 sm:mb-8 text-center">
                            <div className="mx-auto mb-3 sm:mb-4 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-indigo-600 text-white">
                                <ShieldCheckIcon className="h-8 w-8 sm:h-10 sm:w-10" />
                            </div>
                            <h3 className="text-xl sm:text-3xl font-black text-slate-900">Verification</h3>
                            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 sm:mt-2">
                                {isRejected
                                    ? "Application rejected. Please update details."
                                    : "Identity verification is required before creating forms."}
                            </p>
                        </div>

                        {/* --- REJECTION FEEDBACK BOX --- */}
                        {isRejected && user.rejection_reason && (
                            <div className="mb-6 bg-red-50 border border-red-100 p-4 rounded-2xl flex items-start gap-3">
                                <ChatBubbleLeftRightIcon className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                                <div className="text-left">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-red-800">Feedback from Admin</h4>
                                    <p className="text-sm text-red-700 font-medium leading-relaxed mt-1">
                                        "{user.rejection_reason}"
                                    </p>
                                </div>
                            </div>
                        )}

                        <form onSubmit={submitVerification} className="space-y-4 sm:space-y-5">
                            {/* ... existing form fields ... */}
                            <div>
                                <InputLabel htmlFor="full_name" value="Full Legal Name" className="text-xs" />
                                <TextInput
                                    id="full_name"
                                    className="mt-1 block w-full text-sm"
                                    value={data.full_name}
                                    onChange={(e) => setData('full_name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.full_name} className="mt-1 sm:mt-2 text-[10px]" />
                            </div>

                            <div>
                                <InputLabel htmlFor="organization" value="Organization" className="text-xs" />
                                <TextInput
                                    id="organization"
                                    className="mt-1 block w-full text-sm"
                                    value={data.organization}
                                    onChange={(e) => setData('organization', e.target.value)}
                                    required
                                />
                                <InputError message={errors.organization} className="mt-1 sm:mt-2 text-[10px]" />
                            </div>

                            <div>
                                <InputLabel htmlFor="id_photo" value="ID Photo" className="text-xs" />
                                <input
                                    type="file"
                                    className="mt-1 block w-full text-[11px] sm:text-sm text-slate-500 file:mr-2 sm:file:mr-4 file:py-2 file:px-3 sm:file:px-4 file:rounded-full file:border-0 file:text-[10px] sm:file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700"
                                    onChange={(e) => setData('id_photo', e.target.files[0])}
                                    required
                                />
                                <InputError message={errors.id_photo} className="mt-1 sm:mt-2 text-[10px]" />
                            </div>

                            <PrimaryButton className="w-full justify-center py-3 sm:py-4 text-base sm:text-lg" disabled={processing}>
                                {processing ? 'Submitting...' : 'Submit for Review'}
                            </PrimaryButton>
                        </form>
                    </div>
                </div>
            )}

            {/* Share Link Modal */}
            {selectedForm && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
                    <div className="bg-white rounded-t-[2rem] sm:rounded-[2rem] p-6 sm:p-8 max-w-lg w-full shadow-2xl relative animate-in slide-in-from-bottom duration-300">
                        <button
                            onClick={() => setSelectedForm(null)}
                            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-slate-400"
                        >
                            <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>

                        <div className="mb-4 sm:mb-6">
                            <h3 className="text-lg sm:text-2xl font-black text-slate-800">Share Form</h3>
                            <p className="text-slate-500 font-medium text-[11px] sm:text-sm mt-1">Copy the link below to share.</p>
                        </div>

                        <div className="flex items-center gap-2 bg-slate-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-100 mb-6">
                            <input
                                readOnly
                                value={`${window.location.origin}/f/${selectedForm.slug}`}
                                className="flex-1 bg-transparent border-none focus:ring-0 text-[11px] sm:text-sm font-medium text-indigo-600 truncate"
                            />
                            <button
                                onClick={copyToClipboard}
                                className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-sm font-bold transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-white text-slate-700 shadow-sm border border-slate-100'
                                    }`}
                            >
                                {copied ? <CheckIcon className="w-3 h-3 sm:w-4 sm:h-4" /> : <ClipboardIcon className="w-3 h-3 sm:w-4 sm:h-4" />}
                                {copied ? 'Copied' : 'Copy'}
                            </button>
                        </div>

                        <div className="flex gap-3">
                            <a
                                href={route('forms.show', selectedForm.slug)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 flex items-center justify-center gap-2 py-3 sm:py-4 bg-slate-100 text-slate-700 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold"
                            >
                                <ArrowTopRightOnSquareIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                                View
                            </a>
                            <button
                                onClick={() => setSelectedForm(null)}
                                className="flex-1 py-3 sm:py-4 bg-indigo-600 text-white rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold shadow-lg shadow-indigo-100"
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
                    <div className="bg-white rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 max-w-md w-full shadow-2xl border border-white/20">
                        <div className="flex flex-col items-center text-center">
                            <div className="mb-4 sm:mb-6 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-red-50 text-red-600">
                                <ExclamationTriangleIcon className="h-6 w-6 sm:h-8 sm:w-8" />
                            </div>

                            <h3 className="text-lg sm:text-2xl font-black text-slate-900 mb-2">Delete Form?</h3>
                            <p className="text-[11px] sm:text-sm text-slate-500 font-medium mb-6 sm:mb-8 leading-relaxed">
                                Are you sure? <span className="font-bold text-slate-800">"{formToDelete.title}"</span> and its submissions will be permanently lost.
                            </p>

                            <div className="flex w-full gap-2 sm:gap-3">
                                <button
                                    onClick={() => setFormToDelete(null)}
                                    className="flex-1 py-3 sm:py-4 bg-slate-100 text-slate-700 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 py-3 sm:py-4 bg-red-600 text-white rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold shadow-lg shadow-red-100"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}