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
                <div className="flex items-center gap-3 sm:gap-4">
                    <Link href={route('dashboard')} className="text-slate-400 hover:text-slate-600 transition-colors p-1">
                        <ArrowLeftIcon className="w-5 h-5" />
                    </Link>
                    <h2 className="font-black text-lg sm:text-xl text-slate-800 tracking-tight truncate">
                        Results: {form.title}
                    </h2>
                </div>
            }
        >
            <Head title={`Results - ${form.title}`} />

            <div className="py-6 sm:py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="bg-white rounded-[1.5rem] sm:rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    {/* Desktop Table - Hidden on Mobile */}
                    <div className="hidden sm:block overflow-x-auto">
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
                    </div>

                    {/* Mobile List - Visible only on small screens */}
                    <div className="sm:hidden divide-y divide-slate-50">
                        {submissions.data.map((submission) => (
                            <div key={submission.id} className="p-5 flex items-center justify-between active:bg-slate-50 transition-colors">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Submitted At</p>
                                    <div className="flex items-center gap-2 text-slate-600 font-bold text-xs">
                                        <CalendarIcon className="w-3.5 h-3.5" />
                                        {new Date(submission.created_at).toLocaleDateString()} at {new Date(submission.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setSelectedSubmission(submission)}
                                    className="p-3 bg-indigo-50 text-indigo-600 rounded-xl active:scale-95 transition-transform"
                                >
                                    <EyeIcon className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {submissions.data.length === 0 && (
                        <div className="py-16 sm:py-20 text-center">
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs">No responses yet</p>
                        </div>
                    )}
                </div>
            </div>

            {/* --- RESPONSE MODAL --- */}
            {selectedSubmission && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
                        onClick={() => setSelectedSubmission(null)}
                    />

                    {/* Modal Content */}
                    <div className="relative bg-white w-full max-w-2xl h-[90vh] sm:h-auto sm:max-h-[85vh] overflow-hidden rounded-t-[2.5rem] sm:rounded-[3rem] shadow-2xl flex flex-col animate-in slide-in-from-bottom sm:zoom-in duration-300">
                        
                        {/* Modal Header */}
                        <div className="p-6 sm:p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
                            <div>
                                <h3 className="text-lg sm:text-xl font-black text-slate-900">Submission Details</h3>
                                <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                    {new Date(selectedSubmission.created_at).toLocaleString()}
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
                        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 sm:space-y-8">
                            {headers.map((field) => {
                                const answer = selectedSubmission.data[field.id];
                                return (
                                    <div key={field.id} className="space-y-2">
                                        <label className="block text-[9px] sm:text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">
                                            {field.label}
                                        </label>
                                        <div className="bg-slate-50 p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-100">
                                            {Array.isArray(answer) ? (
                                                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                                    {answer.map((val, i) => (
                                                        <span key={i} className="px-2.5 py-1 bg-indigo-600 text-white rounded-lg text-[10px] sm:text-xs font-bold">
                                                            {val}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-sm sm:text-base text-slate-700 font-medium whitespace-pre-wrap leading-relaxed">
                                                    {answer || <span className="text-slate-300 italic font-normal">No response provided.</span>}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-5 sm:p-6 bg-slate-50/50 border-t border-slate-100 text-center shrink-0">
                            <button 
                                onClick={() => setSelectedSubmission(null)}
                                className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-xs sm:text-sm hover:bg-slate-800 transition-all shadow-lg active:scale-95"
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