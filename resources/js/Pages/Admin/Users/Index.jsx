import AdminLayout from '@/Layouts/AdminLayout';
import { router, useForm } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import Swal from 'sweetalert2'; 
import { 
    PencilSquareIcon, 
    TrashIcon, 
    MagnifyingGlassIcon,
    XMarkIcon,
    PowerIcon,
    UserCircleIcon,
    ExclamationTriangleIcon,
    FunnelIcon
} from '@heroicons/react/24/outline';

export default function Index({ users }) {
    // --- STATE ---
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all'); 
    const [statusFilter, setStatusFilter] = useState('all'); 
    
    const [editingUser, setEditingUser] = useState(null);
    const [viewingUser, setViewingUser] = useState(null); 
    const [togglingUser, setTogglingUser] = useState(null);
    const [deletingUser, setDeletingUser] = useState(null);

    // --- FORM SETUP ---
    const { data, setData, patch, processing, errors, reset } = useForm({
        name: '', email: '', role: 0, password: '', 
    });

    // --- TOAST HELPER ---
    const showToast = (title, icon = 'success') => {
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: icon,
            title: title,
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
        });
    };

    // --- FILTER LOGIC ---
    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                 user.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRole = activeTab === 'all' || user.role.toString() === activeTab;
            const matchesStatus = statusFilter === 'all' || user.status.toString() === statusFilter;
            
            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [users, searchTerm, activeTab, statusFilter]);

    // --- HANDLERS ---
    const openEditModal = (user) => {
        setEditingUser(user);
        setData({ name: user.name, email: user.email, role: user.role, password: '' });
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        patch(route('admin.users.update', editingUser.id), {
            onSuccess: () => { 
                setEditingUser(null); 
                showToast('User Updated Successfully');
            },
        });
    };

    const confirmToggleStatus = () => {
        router.patch(route('admin.users.toggle', togglingUser.id), {}, {
            preserveScroll: true,
            onSuccess: () => { 
                setTogglingUser(null); 
                showToast('Status Changed');
            }
        });
    };

    const confirmDelete = () => {
        router.delete(route('admin.users.destroy', deletingUser.id), {
            onSuccess: () => { 
                setDeletingUser(null); 
                showToast('User Removed', 'info');
            },
        });
    };

    return (
        <AdminLayout header="Manage Users" title="User Directory">
            
            {/* --- FILTER & SEARCH BAR --- */}
            <div className="mb-6 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Role Tabs */}
                    <div className="flex bg-slate-100 p-1 rounded-2xl w-fit">
                        {[
                            { id: 'all', label: 'All Users' },
                            { id: '1', label: 'Super Admins' },
                            { id: '0', label: 'Creators' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                    activeTab === tab.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Status Filter */}
                        <div className="relative">
                            <select 
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="pl-4 pr-10 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
                            >
                                <option value="all">All Status</option>
                                <option value="1">Active Only</option>
                                <option value="0">Inactive Only</option>
                            </select>
                            <FunnelIcon className="w-3.5 h-3.5 absolute right-3 top-3 text-slate-400 pointer-events-none" />
                        </div>

                        {/* Search Input */}
                        <div className="relative flex-1 md:w-64">
                            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Search by name or email..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 w-full bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 shadow-sm" 
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* --- USER TABLE --- */}
            <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden relative">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[700px]">
                        <thead className="bg-slate-50/50 text-slate-400 text-[10px] md:text-xs uppercase font-bold tracking-widest">
                            <tr>
                                <th className="px-5 md:px-8 py-4">User Details</th>
                                <th className="px-5 md:px-8 py-4">Role</th>
                                <th className="px-5 md:px-8 py-4">Status</th>
                                <th className="px-5 md:px-8 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-5 md:px-8 py-5">
                                            <div className="font-bold text-slate-700 text-sm">{user.name}</div>
                                            <div className="text-[10px] text-slate-400 font-medium">{user.email}</div>
                                        </td>
                                        <td className="px-5 md:px-8 py-5">
                                            <span className={`px-3 py-1 text-[9px] font-black uppercase rounded-full ${user.role === 1 ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-600'}`}>
                                                {user.role === 1 ? 'Super Admin' : 'Creator'}
                                            </span>
                                        </td>
                                        <td className="px-5 md:px-8 py-5">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${user.status === 1 ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                                                <span className={`text-[10px] font-bold ${user.status === 1 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                    {user.status === 1 ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-5 md:px-8 py-5 text-right">
                                            <div className="flex justify-end gap-1">
                                                <button onClick={() => setViewingUser(user)} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"><UserCircleIcon className="w-5 h-5" /></button>
                                                <button onClick={() => setTogglingUser(user)} className={`p-2 rounded-xl transition-all ${user.status === 1 ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'}`}><PowerIcon className="w-5 h-5" /></button>
                                                <button onClick={() => openEditModal(user)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"><PencilSquareIcon className="w-5 h-5" /></button>
                                                <button onClick={() => setDeletingUser(user)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"><TrashIcon className="w-5 h-5" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="py-20 text-center">
                                        <div className="flex flex-col items-center">
                                            <MagnifyingGlassIcon className="w-12 h-12 text-slate-200 mb-2" />
                                            <p className="text-slate-400 font-medium">No users found matching your filters.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- MODAL SYSTEM --- */}
            {(viewingUser || togglingUser || deletingUser || editingUser) && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    
                    {/* VIEW MODAL */}
                    {viewingUser && (
                        <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 relative shadow-2xl animate-in zoom-in-95 duration-200">
                            <button onClick={() => setViewingUser(null)} className="absolute top-6 right-6 p-2 text-slate-400 hover:bg-slate-50 rounded-full"><XMarkIcon className="w-6 h-6" /></button>
                            <div className="flex flex-col items-center mb-8">
                                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-3xl font-black mb-4">{viewingUser.name.charAt(0)}</div>
                                <h3 className="text-2xl font-black text-slate-800 text-center">{viewingUser.name}</h3>
                                <p className="text-slate-400 font-medium">{viewingUser.email}</p>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-slate-50 p-4 rounded-2xl flex justify-between border border-slate-100">
                                    <span className="text-xs font-bold uppercase text-slate-400">Status</span>
                                    <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-full ${viewingUser.status === 1 ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>{viewingUser.status === 1 ? 'Active' : 'Inactive'}</span>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-2xl flex justify-between border border-slate-100">
                                    <span className="text-xs font-bold uppercase text-slate-400">System Role</span>
                                    <span className="text-sm font-bold text-slate-700">{viewingUser.role === 1 ? 'Super Admin' : 'Form Creator'}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STATUS TOGGLE MODAL */}
                    {togglingUser && (
                        <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 relative shadow-2xl animate-in zoom-in-95 duration-200">
                            <button onClick={() => setTogglingUser(null)} className="absolute top-6 right-6 p-2 text-slate-400 hover:bg-slate-50 rounded-full"><XMarkIcon className="w-6 h-6" /></button>
                            <div className="flex flex-col items-center mb-8">
                                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${togglingUser.status === 1 ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}><PowerIcon className="w-10 h-10" /></div>
                                <h3 className="text-2xl font-black text-slate-800 text-center">{togglingUser.status === 1 ? 'Deactivate?' : 'Activate?'}</h3>
                                <p className="text-slate-500 text-center mt-2">Change status for <b>{togglingUser.name}</b>?</p>
                            </div>
                            <div className="flex flex-col gap-3">
                                <button onClick={confirmToggleStatus} className={`w-full font-bold p-4 rounded-2xl text-white ${togglingUser.status === 1 ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}>Confirm Change</button>
                                <button onClick={() => setTogglingUser(null)} className="w-full bg-slate-100 text-slate-600 font-bold p-4 rounded-2xl">Cancel</button>
                            </div>
                        </div>
                    )}

                    {/* DELETE MODAL */}
                    {deletingUser && (
                        <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 relative shadow-2xl animate-in zoom-in-95 duration-200">
                            <button onClick={() => setDeletingUser(null)} className="absolute top-6 right-6 p-2 text-slate-400 hover:bg-slate-50 rounded-full"><XMarkIcon className="w-6 h-6" /></button>
                            <div className="flex flex-col items-center mb-8">
                                <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 mb-4"><ExclamationTriangleIcon className="w-10 h-10" /></div>
                                <h3 className="text-2xl font-black text-slate-800 text-center">Delete User?</h3>
                                <p className="text-slate-500 text-center mt-2 px-4">Remove <b>{deletingUser.name}</b> permanently? This cannot be undone.</p>
                            </div>
                            <div className="flex flex-col gap-3">
                                <button onClick={confirmDelete} className="w-full bg-rose-600 text-white font-bold p-4 rounded-2xl hover:bg-rose-700">Yes, Delete Account</button>
                                <button onClick={() => setDeletingUser(null)} className="w-full bg-slate-100 text-slate-600 font-bold p-4 rounded-2xl">Cancel</button>
                            </div>
                        </div>
                    )}

                    {/* EDIT MODAL */}
                    {editingUser && (
                        <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 relative shadow-2xl animate-in zoom-in-95 duration-200">
                            <button onClick={() => setEditingUser(null)} className="absolute top-6 right-6 p-2 text-slate-400 hover:bg-slate-50 rounded-full"><XMarkIcon className="w-6 h-6" /></button>
                            <h3 className="text-2xl font-black text-slate-800 mb-2">Edit User</h3>
                            <form onSubmit={handleUpdate} className="space-y-4 mt-6">
                                <div>
                                    <label className="text-xs font-bold uppercase text-slate-400 ml-1">Full Name</label>
                                    <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full mt-1 bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase text-slate-400 ml-1">Role</label>
                                    <select value={data.role} onChange={e => setData('role', parseInt(e.target.value))} className="w-full mt-1 bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500">
                                        <option value={0}>Form Creator</option>
                                        <option value={1}>Super Admin</option>
                                    </select>
                                </div>
                                <button disabled={processing} className="w-full bg-slate-900 text-white font-bold p-4 rounded-2xl shadow-xl disabled:opacity-50">Save Changes</button>
                            </form>
                        </div>
                    )}
                </div>
            )}
        </AdminLayout>
    );
}