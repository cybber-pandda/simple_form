import AdminLayout from '@/Layouts/AdminLayout';
import { useForm, Link } from '@inertiajs/react';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        role: 0, // Default to Form Creator
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.users.store'), {
            onSuccess: () => {
                Swal.fire({
                    title: 'Invitation Sent!',
                    text: `${data.name} has been added to the system.`,
                    icon: 'success',
                    borderRadius: '2rem',
                    confirmButtonColor: '#4f46e5',
                });
            },
        });
    };

    return (
        <AdminLayout header="Create Account" title="New User">
            <div className="mb-6">
                <Link 
                    href={route('admin.users')} 
                    className="flex items-center text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors"
                >
                    <ChevronLeftIcon className="w-4 h-4 mr-1" />
                    Back to Directory
                </Link>
            </div>

            <div className="max-w-2xl bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h3 className="text-2xl font-black text-slate-800 mb-2">New User</h3>
                <p className="text-slate-500 mb-8 font-medium">
                    Enter the details below. A random password will be generated and sent via email.
                </p>

                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <label className="text-xs font-bold uppercase text-slate-400 ml-1">Full Name</label>
                        <input 
                            type="text" 
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            placeholder="John Doe"
                            className="w-full mt-1 bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500" 
                        />
                        {errors.name && <p className="text-rose-500 text-xs mt-1 ml-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="text-xs font-bold uppercase text-slate-400 ml-1">Email Address</label>
                        <input 
                            type="email" 
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                            placeholder="john@example.com"
                            className="w-full mt-1 bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500" 
                        />
                        {errors.email && <p className="text-rose-500 text-xs mt-1 ml-1">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="text-xs font-bold uppercase text-slate-400 ml-1">Access Role</label>
                        <select 
                            value={data.role}
                            onChange={e => setData('role', parseInt(e.target.value))}
                            className="w-full mt-1 bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value={0}>Form Creator</option>
                            <option value={1}>Super Admin</option>
                        </select>
                        <p className="mt-2 text-[11px] text-slate-400 italic px-1">
                            {data.role === 1 
                                ? 'Super Admins can manage users, system settings, and all forms.' 
                                : 'Form Creators can only build, manage, and view responses for their own forms.'}
                        </p>
                    </div>

                    <button 
                        disabled={processing}
                        className="w-full bg-indigo-600 text-white font-bold p-4 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50"
                    >
                        {processing ? 'Creating...' : 'Create & Send Email'}
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
}   