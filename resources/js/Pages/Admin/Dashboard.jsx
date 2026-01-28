import AdminLayout from '@/Layouts/AdminLayout';

export default function Dashboard({ totalUsers, totalForms }) {
    return (
        /* The title="Metrics" prop tells the Layout which tab to highlight */
        <AdminLayout header="Super Admin Portal" title="Metrics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Users Card */}
                <div className="bg-white p-12 rounded-[2.5rem] border border-slate-50 shadow-sm flex flex-col items-center justify-center transition-all hover:shadow-md">
                    <div className="w-14 h-14 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                            <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z" />
                        </svg>
                    </div>
                    <span className="text-7xl font-black text-slate-900 tracking-tighter">{totalUsers}</span>
                    <span className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-4">Users Registered</span>
                </div>

                {/* Forms Card */}
                <div className="bg-white p-12 rounded-[2.5rem] border border-slate-50 shadow-sm flex flex-col items-center justify-center transition-all hover:shadow-md">
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                            <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625Z" />
                            <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
                        </svg>
                    </div>
                    <span className="text-7xl font-black text-slate-900 tracking-tighter">{totalForms}</span>
                    <span className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-4">Active Forms</span>
                </div>

            </div>
        </AdminLayout>
    );
}