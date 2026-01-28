import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { 
    ArrowLeftIcon, 
    EyeIcon, 
    XMarkIcon, 
    CalendarIcon, 
    UserIcon 
} from '@heroicons/react/24/outline';

export default function Submissions({ form, submissions }) {
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const headers = form.schema || [];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link href={route('dashboard')} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <ArrowLeftIcon className="w-5 h-5" />
                    </Link>
                    <h2 className="font-black text-xl text-slate-800 tracking-tight">
                        Results: {form.title}
                    </h2>
                </div>
            }
        >
            <Head title={`Results - ${form.title}`} />

            <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Submission Date</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {submissions.data.map((submission) => (
                                <tr key={submission.id} className="group hover:bg-indigo-50/30 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <CalendarIcon className="w-4 h-4 text-slate-300" />
                                            <span className="text-sm font-bold text-slate-600">
                                                {new Date(submission.created_at).toLocaleString()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <button 
                                            onClick={() => setSelectedSubmission(submission)}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-indigo-600 rounded-xl text-xs font-black uppercase tracking-widest hover:border-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                                        >
                                            <EyeIcon className="w-4 h-4" />
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {submissions.data.length === 0 && (
                        <div className="py-20 text-center">
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No responses yet</p>
                        </div>
                    )}
                </div>
            </div>

            {/* --- RESPONSE MODAL --- */}
            {selectedSubmission && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
                        onClick={() => setSelectedSubmission(null)}
                    />

                    {/* Modal Content */}
                    <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-[3rem] shadow-2xl flex flex-col animate-in fade-in zoom-in duration-200">
                        
                        {/* Modal Header */}
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="text-xl font-black text-slate-900">Submission Details</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                                    Submitted on {new Date(selectedSubmission.created_at).toLocaleString()}
                                </p>
                            </div>
                            <button 
                                onClick={() => setSelectedSubmission(null)}
                                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                            >
                                <XMarkIcon className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>

                        {/* Modal Body (Scrollable Answers) */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8">
                            {headers.map((field) => {
                                const answer = selectedSubmission.data[field.id];
                                return (
                                    <div key={field.id} className="space-y-2">
                                        <label className="block text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">
                                            {field.label}
                                        </label>
                                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                            {Array.isArray(answer) ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {answer.map((val, i) => (
                                                        <span key={i} className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold">
                                                            {val}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-slate-700 font-medium whitespace-pre-wrap leading-relaxed">
                                                    {answer || <span className="text-slate-300 italic font-normal">No response provided.</span>}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 bg-slate-50/50 border-t border-slate-100 text-center">
                            <button 
                                onClick={() => setSelectedSubmission(null)}
                                className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                            >
                                Close Entry
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}