import AdminLayout from '@/Layouts/AdminLayout';
import { router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Swal from 'sweetalert2'; 
import { 
    PencilSquareIcon, 
    TrashIcon, 
    MagnifyingGlassIcon,
    XMarkIcon,
    PowerIcon,
    UserCircleIcon // New Icon for Viewing
} from '@heroicons/react/24/outline';

export default function Index({ users }) {
    const [editingUser, setEditingUser] = useState(null);
    const [viewingUser, setViewingUser] = useState(null); // State for the View Modal
    
    // 1. Setup the Edit Form
    const { data, setData, patch, processing, errors, reset } = useForm({
        name: '',
        email: '',
        role: 0,
        password: '', 
    });

    // 2. Handle Opening/Closing the Edit Modal
    const openEditModal = (user) => {
        setEditingUser(user);
        setData({
            name: user.name,
            email: user.email,
            role: user.role,
            password: '', 
        });
    };

    const closeEditModal = () => {
        setEditingUser(null);
        reset();
    };

    // 3. Submit the Update
    const handleUpdate = (e) => {
        e.preventDefault();
        patch(route('admin.users.update', editingUser.id), {
            onSuccess: () => {
                closeEditModal();
                Swal.fire({
                    title: 'Updated!',
                    text: 'User profile and credentials updated.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false,
                    borderRadius: '2rem',
                });
            },
        });
    };
    
    // 4. Handle Account Activation/Deactivation
    const handleToggleStatus = (user) => {
        router.patch(route('admin.users.toggle', user.id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: `Account ${user.status === 1 ? 'Deactivated' : 'Activated'}`,
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                });
            }
        });
    };

    // 5. Handle Delete
    const handleDelete = (user) => {
        Swal.fire({
            title: 'Delete Account?',
            html: `Are you sure you want to delete <b>${user.name}</b>?<br>This action cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4f46e5',
            cancelButtonColor: '#f43f5e',
            confirmButtonText: 'Yes, delete it',
            cancelButtonText: 'Cancel',
            borderRadius: '2.5rem',
            reverseButtons: true,
            customClass: {
                popup: 'rounded-[2.5rem] p-10 font-sans',
                confirmButton: 'rounded-xl px-6 py-3 font-bold',
                cancelButton: 'rounded-xl px-6 py-3 font-bold'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('admin.users.destroy', user.id), {
                    onSuccess: () => {
                        Swal.fire({
                            title: 'Deleted!',
                            text: 'The user has been removed.',
                            icon: 'success',
                            timer: 2000,
                            showConfirmButton: false,
                            borderRadius: '2rem',
                        });
                    },
                });
            }
        });
    };

    return (
        <AdminLayout header="Manage Users" title="User Directory">
            
            {/* --- USER TABLE --- */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-slate-800">User Directory</h3>
                    <div className="relative">
                        <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search users..." 
                            className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 w-64" 
                        />
                    </div>
                </div>

                <table className="w-full text-left">
                    <thead className="bg-slate-50/50 text-slate-400 text-xs uppercase font-bold tracking-widest">
                        <tr>
                            <th className="px-8 py-4">User Details</th>
                            <th className="px-8 py-4">Role</th>
                            <th className="px-8 py-4">Status</th>
                            <th className="px-8 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-8 py-5">
                                    <div className="font-bold text-slate-700">{user.name}</div>
                                    <div className="text-xs text-slate-400 font-medium">{user.email}</div>
                                </td>
                                <td className="px-8 py-5">
                                    <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-full tracking-wider ${
                                        user.role === 1 ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-600'
                                    }`}>
                                        {user.role === 1 ? 'Super Admin' : 'Creator'}
                                    </span>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${user.status === 1 ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                                        <span className={`text-xs font-bold ${user.status === 1 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                            {user.status === 1 ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-right space-x-1">
                                    {/* --- VIEW ACTION --- */}
                                    <button 
                                        onClick={() => setViewingUser(user)}
                                        className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
                                        title="View Profile"
                                    >
                                        <UserCircleIcon className="w-5 h-5" />
                                    </button>

                                    <button 
                                        onClick={() => handleToggleStatus(user)}
                                        className={`p-2 rounded-xl transition-all ${
                                            user.status === 1 
                                            ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50' 
                                            : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                                        }`}
                                        title={user.status === 1 ? 'Deactivate' : 'Activate'}
                                    >
                                        <PowerIcon className="w-5 h-5" />
                                    </button>
                                    <button 
                                        onClick={() => openEditModal(user)}
                                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                                    >
                                        <PencilSquareIcon className="w-5 h-5" />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(user)}
                                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- VIEW MODAL --- */}
            {viewingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 relative animate-in zoom-in-95 duration-200">
                        <button onClick={() => setViewingUser(null)} className="absolute top-6 right-6 p-2 text-slate-400 hover:bg-slate-50 rounded-full">
                            <XMarkIcon className="w-6 h-6" />
                        </button>

                        <div className="flex flex-col items-center mb-8">
                            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-3xl font-black mb-4">
                                {viewingUser.name.charAt(0)}
                            </div>
                            <h3 className="text-2xl font-black text-slate-800">{viewingUser.name}</h3>
                            <span className="text-slate-400 font-medium">{viewingUser.email}</span>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-slate-50 p-4 rounded-2xl flex justify-between items-center border border-slate-100">
                                <span className="text-xs font-bold uppercase text-slate-400">Account Status</span>
                                <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-full ${viewingUser.status === 1 ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                    {viewingUser.status === 1 ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-2xl flex justify-between items-center border border-slate-100">
                                <span className="text-xs font-bold uppercase text-slate-400">System Role</span>
                                <span className="text-sm font-bold text-slate-700">
                                    {viewingUser.role === 1 ? 'Super Admin' : 'Form Creator'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- EDIT MODAL --- */}
            {editingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 relative animate-in zoom-in-95 duration-200">
                        <button 
                            onClick={closeEditModal}
                            className="absolute top-6 right-6 p-2 text-slate-400 hover:bg-slate-50 rounded-full"
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>

                        <h3 className="text-2xl font-black text-slate-800 mb-2">Edit Account</h3>
                        <p className="text-slate-500 mb-8 font-medium text-sm">Update user profile and system access.</p>

                        <form onSubmit={handleUpdate} className="space-y-5">
                            <div>
                                <label className="text-xs font-bold uppercase text-slate-400 ml-1">Full Name</label>
                                <input 
                                    type="text" 
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
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
                            </div>

                            <div>
                                <label className="text-xs font-bold uppercase text-slate-400 ml-1">
                                    New Password <span className="lowercase font-normal italic">(Leave blank to keep current)</span>
                                </label>
                                <input 
                                    type="password" 
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full mt-1 bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500" 
                                />
                                {errors.password && <p className="text-rose-500 text-xs mt-1 ml-1">{errors.password}</p>}
                            </div>

                            <button 
                                disabled={processing}
                                className="w-full bg-slate-900 text-white font-bold p-4 rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
                            >
                                {processing ? 'Saving Changes...' : 'Save Changes'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}