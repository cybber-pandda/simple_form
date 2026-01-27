import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header="Overview"
        >
            <Head title="Dashboard" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Welcome Bento Card */}
                    <div className="relative overflow-hidden bg-white shadow-2xl shadow-slate-200/50 rounded-[2.5rem] border border-slate-100">
                        {/* Decorative Background Pattern */}
                        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-indigo-50 rounded-full blur-3xl opacity-50" />
                        
                        <div className="relative p-10 sm:p-16 flex flex-col items-center text-center">
                            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>

                            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
                                Ready to build something great?
                            </h1>
                            
                            <p className="max-w-xl text-lg font-medium text-slate-500 mb-10">
                                Welcome to FormFlow. You haven't created any forms yet. 
                                Start capturing data with our premium drag-and-drop builder.
                            </p>

                            <PrimaryButton className="w-full sm:w-auto">
                                Create Your First Form
                            </PrimaryButton>
                        </div>
                    </div>

                    {/* Secondary Bento Grid (Stats/Help) */}
                    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
                        {[
                            { label: 'Total Submissions', value: '0', color: 'bg-blue-500' },
                            { label: 'Active Forms', value: '0', color: 'bg-emerald-500' },
                            { label: 'Conversion Rate', value: '0%', color: 'bg-amber-500' },
                        ].map((stat, i) => (
                            <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm transition-transform hover:scale-[1.02]">
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                <p className="mt-2 text-3xl font-black text-slate-900">{stat.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}