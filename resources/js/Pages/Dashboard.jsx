import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link } from '@inertiajs/react';
import { PlusIcon, ArrowTopRightOnSquareIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

export default function Dashboard({ totalForms, activeForms, forms = [] }) {
    const hasForms = totalForms > 0;

    return (
        <AuthenticatedLayout header="Overview">
            <Head title="Dashboard" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-8">
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                        {[
                            { label: 'Total Submissions', value: '0', icon: <ChatBubbleLeftRightIcon className="w-5 h-5 text-blue-500" /> },
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
                        /* Empty State: Welcome Bento Card */
                        <div className="relative overflow-hidden bg-white shadow-2xl shadow-slate-200/50 rounded-[2.5rem] border border-slate-100">
                            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-indigo-50 rounded-full blur-3xl opacity-50" />
                            <div className="relative p-10 sm:p-16 flex flex-col items-center text-center">
                                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-200">
                                    <PlusIcon className="h-8 w-8" />
                                </div>
                                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">Ready to build something great?</h1>
                                <p className="max-w-xl text-lg font-medium text-slate-500 mb-10">
                                    Welcome to FormFlow. You haven't created any forms yet. Start capturing data with our premium builder.
                                </p>
                                <Link href={route('forms.create')}>
                                    <PrimaryButton>Create Your First Form</PrimaryButton>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        /* Active State: Form List */
                        <div className="space-y-4">
                            <div className="flex justify-between items-center px-4">
                                <h2 className="text-xl font-black text-slate-900">Your Recent Forms</h2>
                                <Link href={route('forms.create')} className="text-sm font-bold text-indigo-600 hover:text-indigo-700">
                                    + Create New
                                </Link>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-4">
                                {forms.map((form) => (
                                    <div key={form.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4 transition-all hover:border-indigo-200">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900">{form.title}</h3>
                                                <p className="text-xs text-slate-400 font-medium">Created {new Date(form.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        
                                        {/* Inside the forms.map loop, next to "View Public Link" */}
                                        <div className="flex items-center gap-2">
                                            {/* New: Link to Submissions */}
                                            <Link 
                                                href={route('forms.submissions', form.id)} 
                                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-100 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition-all shadow-sm"
                                            >
                                                <ChatBubbleLeftRightIcon className="w-4 h-4" />
                                                {form.submissions_count || 0} Submissions
                                            </Link>

                                            <a 
                                                href={`/f/${form.slug}`} 
                                                target="_blank" 
                                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200"
                                            >
                                                <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                                                View Public Link
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}