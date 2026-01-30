import AdminLayout from '@/Layouts/AdminLayout';
import { useForm } from '@inertiajs/react';
import { 
    ChevronDownIcon, 
    UserIcon, 
    EnvelopeIcon, 
    ShieldCheckIcon,
    PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        role: 0, 
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.users.store'), {
            onSuccess: () => {
                Swal.fire({
                    title: 'Invitation Sent!',
                    text: `${data.name} has been added to the system.`,
                    icon: 'success',
                    padding: '2rem',
                    borderRadius: '2rem',
                    confirmButtonColor: '#4f46e5',
                    customClass: {
                        title: 'font-black text-slate-800',
                        confirmButton: 'rounded-xl px-8 py-3 font-bold'
                    }
                });
            },
        });
    };

    return (
        <AdminLayout header="Create Account" title="New User">
            {/* Removed the large wrapper padding/height to align with the sidebar */}
            <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* --- MAIN FORM CARD --- */}
                <div className="bg-white p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border border-slate-100 shadow-[0_15px_50px_rgba(0,0,0,0.02)]">
                    
                    {/* Header Section */}
                    <header className="mb-8 text-left">
                        <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-1 tracking-tight">Create User</h3>
                        <p className="text-sm md:text-base text-slate-500 font-medium leading-relaxed max-w-md">
                            Setting up a new account? We'll send them a secure invitation link to get started.
                        </p>
                    </header>

                    <form onSubmit={submit} className="space-y-5">
                        {/* Full Name Input */}
                        <div className="space-y-1.5 group">
                            <label className="text-[10px] md:text-xs font-black uppercase tracking-[0.15em] text-slate-400 ml-1 group-focus-within:text-indigo-600 transition-colors">
                                Full Name
                            </label>
                            <div className="relative">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                    <UserIcon className="w-5 h-5" />
                                </div>
                                <input 
                                    type="text" 
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="e.g. John Doe"
                                    className="w-full bg-slate-50/50 border-2 border-slate-50 rounded-2xl py-4 pl-14 pr-5 text-sm md:text-base focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-slate-700 placeholder:text-slate-300 shadow-sm" 
                                />
                            </div>
                            {errors.name && <p className="text-rose-500 text-[10px] mt-1 ml-1 font-bold">{errors.name}</p>}
                        </div>

                        {/* Email Input */}
                        <div className="space-y-1.5 group">
                            <label className="text-[10px] md:text-xs font-black uppercase tracking-[0.15em] text-slate-400 ml-1 group-focus-within:text-indigo-600 transition-colors">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                    <EnvelopeIcon className="w-5 h-5" />
                                </div>
                                <input 
                                    type="email" 
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    placeholder="john@example.com"
                                    className="w-full bg-slate-50/50 border-2 border-slate-50 rounded-2xl py-4 pl-14 pr-5 text-sm md:text-base focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-slate-700 placeholder:text-slate-300 shadow-sm" 
                                />
                            </div>
                            {errors.email && <p className="text-rose-500 text-[10px] mt-1 ml-1 font-bold">{errors.email}</p>}
                        </div>

                        {/* Access Role Selection */}
                        <div className="space-y-1.5 group">
                            <label className="text-[10px] md:text-xs font-black uppercase tracking-[0.15em] text-slate-400 ml-1 group-focus-within:text-indigo-600 transition-colors">
                                Access Role
                            </label>
                            <div className="relative">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors z-10">
                                    <ShieldCheckIcon className="w-5 h-5" />
                                </div>
                                <select 
                                    value={data.role}
                                    onChange={e => setData('role', parseInt(e.target.value))}
                                    className="relative w-full bg-slate-50/50 border-2 border-slate-50 rounded-2xl py-4 pl-14 pr-12 text-sm md:text-base focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-500/5 transition-all font-black text-slate-700 appearance-none cursor-pointer z-0 shadow-sm"
                                >
                                    <option value={0}>Form Creator</option>
                                    <option value={1}>Super Admin</option>
                                </select>
                            </div>
                            
                            <div className={`mt-3 p-4 rounded-2xl border transition-all duration-500 ${data.role === 1 ? 'bg-rose-50/50 border-rose-100' : 'bg-indigo-50/50 border-indigo-100'}`}>
                                <div className="flex gap-4">
                                    <div className={`mt-0.5 p-1.5 rounded-lg h-fit ${data.role === 1 ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                        <ShieldCheckIcon className="w-4 h-4" />
                                    </div>
                                    <p className={`text-[11px] md:text-xs font-bold leading-relaxed tracking-tight ${data.role === 1 ? 'text-rose-700' : 'text-indigo-700'}`}>
                                        {data.role === 1 
                                            ? 'SYSTEM AUTHORITY: Super Admins possess full system control and access to all global data.' 
                                            : 'CREATOR STATUS: Users can manage their personal workspace and build forms.'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Submit Action */}
                        <div className="pt-2">
                            <button 
                                disabled={processing}
                                className="group relative w-full bg-slate-900 text-white font-black py-5 rounded-2xl hover:bg-indigo-600 active:scale-[0.98] transition-all shadow-xl shadow-slate-200 hover:shadow-indigo-200 disabled:opacity-50 overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-3 text-sm tracking-widest uppercase">
                                    {processing ? 'Processing...' : (
                                        <>
                                            Create Account
                                            <PaperAirplaneIcon className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </>
                                    )}
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}