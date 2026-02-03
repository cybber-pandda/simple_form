import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import XLSX from 'xlsx-js-style';
import {
    ArrowLeftIcon,
    EyeIcon,
    XMarkIcon,
    CalendarIcon,
    ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

export default function Submissions({ form, submissions }) {
    const [selectedSubmission, setSelectedSubmission] = useState(null);

    // Safety check: if form or schema is missing, default to empty array
    const headers = form?.schema || [];

    const exportToExcel = () => {
        try {
            // 1. Prepare branding rows
            const branding = [
                ["FORMFLOW | OFFICIAL REPORT"], // Row 1
                [`Form: ${form.title.toUpperCase()}`], // Row 2
                [], // Row 3 (Empty spacer)
            ];

            // 2. Prepare the data headers and content
            const dataHeaders = ['Submission Date', ...headers.map(h => h.label)];
            const dataRows = submissions.data.map((submission) => {
                const row = [new Date(submission.created_at).toLocaleString()];
                headers.forEach((field) => {
                    const answer = submission.data[field.id];
                    row.push(Array.isArray(answer) ? answer.join(', ') : (answer || '—'));
                });
                return row;
            });

            // Combine everything: [Branding, Headers, Data]
            const finalData = [...branding, dataHeaders, ...dataRows];

            // 3. Create worksheet
            const worksheet = XLSX.utils.aoa_to_sheet(finalData);

            // 4. APPLY BRANDED STYLING
            const THEME_COLOR = '4F46E5'; // Indigo
            const TEXT_COLOR = 'FFFFFF';

            // Style the Brand Header (Row 1)
            worksheet['A1'].s = {
                font: { name: 'Segoe UI', sz: 16, bold: true, color: { rgb: THEME_COLOR } },
                alignment: { horizontal: "left" }
            };

            // Style the Form Title (Row 2)
            worksheet['A2'].s = {
                font: { name: 'Segoe UI', sz: 12, italic: true, color: { rgb: "64748B" } }, // Slate-500
                alignment: { horizontal: "left" }
            };

            // Style the Table Headers (Now on Row 4)
            const range = XLSX.utils.decode_range(worksheet['!ref']);
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const address = XLSX.utils.encode_col(C) + "4";
                if (!worksheet[address]) continue;

                worksheet[address].s = {
                    fill: { fgColor: { rgb: THEME_COLOR } },
                    font: { name: 'Segoe UI', sz: 11, bold: true, color: { rgb: TEXT_COLOR } },
                    alignment: { vertical: "center", horizontal: "center" },
                    border: {
                        bottom: { style: "medium", color: { rgb: "3730A3" } }
                    }
                };
            }

            // 5. DYNAMIC WIDTHS
            const objectMaxLength = [];
            // We check the dataRows and the dataHeaders for lengths
            dataHeaders.forEach((header, i) => {
                let maxLen = header.length;
                dataRows.forEach(row => {
                    const cellValue = String(row[i] || "");
                    if (cellValue.length > maxLen) maxLen = cellValue.length;
                });
                objectMaxLength.push({ wch: maxLen + 10 });
            });
            worksheet['!cols'] = objectMaxLength;

            // 6. Create Workbook and Download
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Submissions");

            const fileName = `FormFlow_${form.title.replace(/\s+/g, '_')}_Report.xlsx`;
            XLSX.writeFile(workbook, fileName);

        } catch (error) {
            console.error("Branded Export Error:", error);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <Link href={route('dashboard')} className="text-slate-400 hover:text-slate-600 transition-colors p-1">
                            <ArrowLeftIcon className="w-5 h-5" />
                        </Link>
                        <h2 className="font-black text-lg sm:text-xl text-slate-800 tracking-tight truncate">
                            Results: {form.title}
                        </h2>
                    </div>

                    {/* Only show export button if there are submissions */}
                    {submissions.data.length > 0 && (
                        <button
                            onClick={exportToExcel}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-md active:scale-95"
                        >
                            <ArrowDownTrayIcon className="w-4 h-4" />
                            <span className="hidden sm:inline">Export Excel</span>
                        </button>
                    )}
                </div>
            }
        >
            <Head title={`Results - ${form.title}`} />

            <div className="py-6 sm:py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-[1.5rem] sm:rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">

                    {/* Desktop Table */}
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

                    {/* Mobile List */}
                    <div className="sm:hidden divide-y divide-slate-50">
                        {submissions.data.map((submission) => (
                            <div key={submission.id} className="p-5 flex items-center justify-between active:bg-slate-50 transition-colors">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Submitted At</p>
                                    <div className="flex items-center gap-2 text-slate-600 font-bold text-xs">
                                        <CalendarIcon className="w-3.5 h-3.5" />
                                        {new Date(submission.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedSubmission(submission)}
                                    className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"
                                >
                                    <EyeIcon className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {submissions.data.length === 0 && (
                        <div className="py-16 text-center">
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No responses yet</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Response Modal */}
            {selectedSubmission && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedSubmission(null)} />
                    <div className="relative bg-white w-full max-w-2xl h-[90vh] sm:h-auto sm:max-h-[85vh] overflow-hidden rounded-t-[2.5rem] sm:rounded-[3rem] shadow-2xl flex flex-col">
                        <div className="p-6 sm:p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
                            <div>
                                <h3 className="text-lg sm:text-xl font-black text-slate-900">Submission Details</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                    {new Date(selectedSubmission.created_at).toLocaleString()}
                                </p>
                            </div>
                            <button onClick={() => setSelectedSubmission(null)} className="p-2 hover:bg-slate-200 rounded-full">
                                <XMarkIcon className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
                            {headers.map((field) => {
                                const answer = selectedSubmission.data[field.id];
                                return (
                                    <div key={field.id} className="space-y-2">
                                        <label className="block text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                                            {field.label}
                                        </label>
                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                            {Array.isArray(answer) ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {answer.map((val, i) => (
                                                        <span key={i} className="px-2 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold">
                                                            {val}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-slate-700 font-medium">
                                                    {answer || <span className="text-slate-300 italic">No response.</span>}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="p-5 sm:p-6 bg-slate-50/50 border-t border-slate-100 text-center">
                            <button onClick={() => setSelectedSubmission(null)} className="w-full sm:w-auto px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest">
                                Close Entry
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}