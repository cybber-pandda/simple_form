import React, { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ConfirmationModal from '@/Components/ConfirmationModal';

export default function Index({ auth, notifications }) {
    const [selectedIds, setSelectedIds] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pendingDeletionIds, setPendingDeletionIds] = useState([]);

    const formatNotifDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
        return `${date.toLocaleDateString('en-US', options)} • ${date.toLocaleTimeString('en-US', timeOptions)}`;
    };

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

    const handleToggleRead = (id, isRead) => {
        const routeName = isRead ? 'notifications.markUnread' : 'notifications.markRead';
        router.post(route(routeName), { ids: [id] });
    };

    const handleBulkMarkRead = () => {
        router.post(route('notifications.markRead'), { ids: selectedIds }, {
            onSuccess: () => setSelectedIds([])
        });
    };

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

            <div className="mt-8 max-w-5xl mx-auto px-4 pb-12">
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
                                className={`group relative flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 ${selectedIds.includes(n.id) ? 'border-indigo-300 bg-indigo-50/30' :
                                        !n.read_at ? 'border-indigo-100 bg-white shadow-sm' : 'border-slate-200/60 bg-white/50'
                                    }`}
                            >
                                {/* Unread indicator bar */}
                                {!n.read_at && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-indigo-600 rounded-r-full shadow-[2px_0_10px_rgba(79,70,229,0.4)]" />
                                )}

                                <input
                                    type="checkbox"
                                    className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer z-10 shrink-0"
                                    checked={selectedIds.includes(n.id)}
                                    onChange={() => toggleSelect(n.id)}
                                />

                                <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4 min-w-0">
                                    <div className="flex gap-4 items-start min-w-0">
                                        <div className={`mt-1 h-12 w-12 shrink-0 rounded-2xl flex items-center justify-center transition-colors
                                            ${!n.read_at ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                            </svg>
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <h3 className={`font-bold text-base truncate ${!n.read_at ? 'text-slate-900' : 'text-slate-500'}`}>
                                                {n.data.title}
                                            </h3>
                                            <p className="text-sm text-slate-500 mt-0.5 line-clamp-1 leading-relaxed">
                                                {n.data.message}
                                            </p>
                                            {/* --- ADD REASON HERE --- */}
                                            {n.data.reason && (
                                                <div className="mt-2 inline-flex items-center gap-2 bg-red-50 border border-red-100 px-3 py-1.5 rounded-lg">
                                                    <span className="text-[10px] font-black uppercase tracking-tighter text-red-600">
                                                        Reason:
                                                    </span>
                                                    <p className="text-xs font-bold text-red-700">
                                                        {n.data.reason}
                                                    </p>
                                                </div>
                                            )}
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1 block">
                                                {formatNotifDate(n.created_at)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Buttons: Grouped [VIEW] [READ/UNREAD] [DELETE] */}
                                    <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">

                                        {/* 1. View Button (Left-most action) */}
                                        {(n.data.route_name || n.data.form_id) && (
                                            <Link
                                                href={
                                                    n.data.route_name
                                                        ? route(n.data.route_name, n.data.params || {})
                                                        : route('forms.submissions', n.data.form_id)
                                                }
                                                className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm shadow-indigo-100 transition-all active:scale-95 whitespace-nowrap mr-1"
                                            >
                                                View
                                            </Link>
                                        )}

                                        {/* 2. Toggle Read/Unread Icon */}
                                        <button
                                            onClick={() => handleToggleRead(n.id, !!n.read_at)}
                                            className={`p-2 rounded-xl transition-all ${!n.read_at
                                                    ? 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'
                                                    : 'text-indigo-600 hover:bg-indigo-100'
                                                }`}
                                            title={n.read_at ? "Mark as unread" : "Mark as read"}
                                        >
                                            {n.read_at ? (
                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                            ) : (
                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M13 11.75l6.75 4.5m-13.5 0L11 11.75" />
                                                </svg>
                                            )}
                                        </button>

                                        {/* 3. Delete Button (Right-most action) */}
                                        <button
                                            onClick={() => openDeleteModal([n.id])}
                                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                            title="Delete"
                                        >
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-24 bg-white/40 rounded-3xl border border-dashed border-slate-300">
                            <div className="bg-slate-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                            </div>
                            <p className="text-slate-500 font-bold">Your inbox is empty</p>
                            <p className="text-slate-400 text-sm mt-1">We'll notify you when something happens.</p>
                        </div>
                    )}
                </div>
            </div>

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