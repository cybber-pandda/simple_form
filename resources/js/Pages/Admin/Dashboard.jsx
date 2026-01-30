import AdminLayout from '@/Layouts/AdminLayout';
import { UserGroupIcon, DocumentDuplicateIcon, ArrowUpRightIcon } from '@heroicons/react/24/outline';

export default function Dashboard({ totalUsers, totalForms }) {
    return (
        /* The title="Metrics" prop tells the Layout which tab to highlight */
        <AdminLayout header="Super Admin Portal" title="Metrics">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* Users Card */}
                <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col transition-all hover:shadow-md group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                            <UserGroupIcon className="w-6 h-6" />
                        </div>
                        <span className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-wider">
                            <ArrowUpRightIcon className="w-3 h-3" />
                            Live
                        </span>
                    </div>
                    
                    <div>
                        <h4 className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.15em] mb-1">Total Community</h4>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                                {totalUsers}
                            </span>
                            <span className="text-slate-400 font-bold text-sm">Users</span>
                        </div>
                    </div>
                </div>

                {/* Forms Card */}
                <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col transition-all hover:shadow-md group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                            <DocumentDuplicateIcon className="w-6 h-6" />
                        </div>
                        <span className="flex items-center gap-1 text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full uppercase tracking-wider">
                            Global
                        </span>
                    </div>

                    <div>
                        <h4 className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.15em] mb-1">System Usage</h4>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                                {totalForms}
                            </span>
                            <span className="text-slate-400 font-bold text-sm">Forms</span>
                        </div>
                    </div>
                </div>

                {/* Optional Placeholder/Third Stat for visual balance */}
                <div className="hidden lg:flex bg-slate-50/50 p-6 md:p-8 rounded-[2rem] border border-dashed border-slate-200 flex-col items-center justify-center text-center">
                    <p className="text-slate-400 text-xs font-medium max-w-[150px]">
                        More platform metrics coming soon...
                    </p>
                </div>

            </div>
        </AdminLayout>
    );
}