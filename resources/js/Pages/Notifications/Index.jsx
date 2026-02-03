import React, { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
// Import the modal component (assuming you created the file from the previous step)
import ConfirmationModal from '@/Components/ConfirmationModal';

export default function Index({ auth, notifications }) {
    const [selectedIds, setSelectedIds] = useState([]);
    
    // --- NEW MODAL STATE ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pendingDeletionIds, setPendingDeletionIds] = useState([]);

    const toggleSelectAll = () => {
        if (selectedIds.length === notifications.data.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(notifications.data.map(n => n.id));
        }
    };

    const toggleSelect = (id) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleBulkMarkRead = () => {
        router.post(route('notifications.markRead'), { ids: selectedIds }, {
            onSuccess: () => setSelectedIds([])
        });
    };

    // --- UPDATED DELETE LOGIC ---
    const openDeleteModal = (ids) => {
        setPendingDeletionIds(ids);
        setIsModalOpen(true);
    };

    const confirmDelete = () => {
        router.delete(route('notifications.destroy'), { 
            data: { ids: pendingDeletionIds },
            onSuccess: () => {
                setSelectedIds([]);
                setIsModalOpen(false);
                setPendingDeletionIds([]);
            }
        });
    };

    return (
        <AuthenticatedLayout header="Notifications">
            <Head title="Notifications" />

            <div className="mt-8 max-w-5xl mx-auto">
                {/* Header Actions */}
                <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
                    <div className="flex items-center gap-4">
                        <input 
                            type="checkbox" 
                            className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                            checked={selectedIds.length === notifications.data.length && notifications.data.length > 0}
                            onChange={toggleSelectAll}
                        />
                        <span className="text-sm font-bold text-slate-600">
                            {selectedIds.length > 0 ? `${selectedIds.length} Selected` : 'Select All'}
                        </span>
                    </div>

                    {selectedIds.length > 0 ? (
                        <div className="flex items-center gap-2 animate-in fade-in zoom-in duration-200">
                            <button 
                                onClick={handleBulkMarkRead}
                                className="px-4 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all"
                            >
                                Mark as Read
                            </button>
                            <button 
                                onClick={() => openDeleteModal(selectedIds)}
                                className="px-4 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all"
                            >
                                Delete
                            </button>
                        </div>
                    ) : (
                        <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">
                            Inbox: {notifications.total} total
                        </p>
                    )}
                </div>

                {/* Notification List */}
                <div className="space-y-3">
                    {notifications.data.length > 0 ? (
                        notifications.data.map((n) => (
                            <div 
                                key={n.id} 
                                className={`group relative flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 ${
                                    selectedIds.includes(n.id) ? 'border-indigo-300 bg-indigo-50/30' : 
                                    !n.read_at ? 'border-indigo-100 bg-white shadow-sm' : 'border-slate-200/60 bg-white/50'
                                }`}
                            >
                                {/* ... Status Indicator ... */}
                                {!n.read_at && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 rounded-r-full shadow-[2px_0_8px_rgba(79,70,229,0.4)]" />
                                )}

                                <input 
                                    type="checkbox" 
                                    className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                    checked={selectedIds.includes(n.id)}
                                    onChange={() => toggleSelect(n.id)}
                                />

                                <div className="flex-1 flex items-center justify-between gap-4">
                                    <div className="flex gap-4 items-start">
                                        {/* Icons stay the same */}
                                        <div className={`mt-1 h-10 w-10 shrink-0 rounded-xl flex items-center justify-center 
                                            ${n.data.type === 'security' ? 'bg-amber-500 text-white' : 
                                              n.data.type === 'verification' 
                                                ? (n.data.status === 'approved' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white')
                                                : (!n.read_at ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400')
                                            }`}>
                                            {/* (SVG Icons remain the same as your code) */}
                                            {n.data.type === 'security' ? (
                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                            ) : (
                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                                            )}
                                        </div>

                                        <div>
                                            <h3 className={`font-bold text-sm ${!n.read_at ? 'text-slate-900' : 'text-slate-500'}`}>{n.data.title}</h3>
                                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{n.data.message}</p>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1 block">
                                                {new Date(n.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Link 
                                            href={n.data.type === 'security' || n.data.type === 'verification' ? route('profile.edit') : route('forms.submissions', n.data.form_id || 0)}
                                            className="px-3 py-1.5 text-[11px] font-bold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-600 hover:text-white transition-all"
                                        >
                                            View
                                        </Link>
                                        
                                        <button 
                                            onClick={() => openDeleteModal([n.id])}
                                            className="p-1.5 text-slate-300 hover:text-red-500 transition-colors"
                                        >
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white/40 rounded-3xl border border-dashed border-slate-300">
                             <p className="text-slate-500 font-medium">No notifications found.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* --- THE MODAL --- */}
            <ConfirmationModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Notifications?"
                message={`Are you sure you want to permanently delete ${pendingDeletionIds.length} selected notification(s)? This action cannot be undone.`}
            />
        </AuthenticatedLayout>
    );
}