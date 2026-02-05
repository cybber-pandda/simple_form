import AdminLayout from '@/Layouts/AdminLayout';
import { router, useForm } from '@inertiajs/react';
import { CheckBadgeIcon, XCircleIcon, EyeIcon, ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import Modal from '@/Components/Modal';

export default function Index({ pendingUsers = [] }) {
    const [selectedImage, setSelectedImage] = useState(null);

    // --- Approval State ---
    const [confirmingUserApproval, setConfirmingUserApproval] = useState(false);
    const [userToApprove, setUserToApprove] = useState(null);

    // --- Rejection State & Form ---
    const [confirmingUserRejection, setConfirmingUserRejection] = useState(false);
    const [userToReject, setUserToReject] = useState(null);

    const { data, setData, patch, processing, reset, errors } = useForm({
        status: 'rejected',
        reason: '',
    });

    // --- Approval Actions ---
    const openApprovalModal = (user) => {
        setUserToApprove(user);
        setConfirmingUserApproval(true);
    };

    const handleConfirmApprove = () => {
        router.patch(route('admin.verifications.update', userToApprove.id), {
            status: 'approved'
        }, { onSuccess: () => setConfirmingUserApproval(false) });
    };

    // --- Rejection Actions ---
    const openRejectionModal = (user) => {
        setUserToReject(user);
        setConfirmingUserRejection(true);
    };

    const closeRejectionModal = () => {
        setConfirmingUserRejection(false);
        setUserToReject(null);
        reset();
    };

    const handleConfirmReject = (e) => {
        e.preventDefault();
        patch(route('admin.verifications.update', userToReject.id), {
            onSuccess: () => closeRejectionModal(),
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout header="Identity Verifications" title="Verifications">
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {pendingUsers.length === 0 ? (
                    <div className="bg-white p-10 md:p-20 rounded-[2rem] border border-dashed border-slate-200 text-center">
                        <CheckBadgeIcon className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-900">All caught up!</h3>
                        <p className="text-slate-500 font-medium text-sm">No pending verification requests.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {pendingUsers.map((user) => (
                            <div key={user.id} className="bg-white p-5 md:p-7 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col gap-6 transition-all hover:shadow-md">
                                <div className="flex justify-between items-start gap-2">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-lg">
                                            {user.full_name ? user.full_name.charAt(0) : 'U'}
                                        </div>
                                        <div>
                                            <h3 className="font-black text-slate-900 text-base">{user.full_name}</h3>
                                            <p className="text-sm text-slate-500 font-medium">{user.organization}</p>
                                        </div>
                                    </div>
                                    <span className="shrink-0 px-2.5 py-1 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-100">
                                        Pending
                                    </span>
                                </div>

                                <div className="relative group aspect-video bg-slate-100 rounded-[1.5rem] overflow-hidden border border-slate-200">
                                    <img src={`/storage/${user.id_photo_path}`} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" alt="ID" />
                                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                        <button onClick={() => setSelectedImage(`/storage/${user.id_photo_path}`)} className="bg-white text-slate-900 px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2">
                                            <EyeIcon className="w-5 h-5" /> View Full ID
                                        </button>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => openApprovalModal(user)}
                                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-4 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-indigo-600 transition-all shadow-lg active:translate-y-0.5"
                                    >
                                        <CheckBadgeIcon className="w-4 h-4" /> Approve
                                    </button>

                                    <button
                                        onClick={() => openRejectionModal(user)}
                                        className="inline-flex items-center gap-2 px-4 py-4 bg-white border border-slate-100 text-red-500 text-xs font-bold rounded-xl hover:bg-red-50 hover:border-red-100 transition-all shadow-sm active:translate-y-0.5"
                                    >
                                        <XCircleIcon className="w-4 h-4" /> Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* --- APPROVAL MODAL --- */}
            <Modal show={confirmingUserApproval} onClose={() => setConfirmingUserApproval(false)} maxWidth="md">
                <div className="text-center p-2">
                    {/* Centered Icon Container */}
                    <div className="bg-indigo-50 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                        <CheckBadgeIcon className="w-10 h-10 text-indigo-600" />
                    </div>

                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Approve Access?</h2>

                    <p className="mt-4 text-slate-500 font-medium text-base px-4 leading-relaxed">
                        Verifying <span className="text-slate-900 font-bold">{userToApprove?.full_name}</span> will grant them full access. They will be notified via email.
                    </p>

                    {/* Action Buttons */}
                    <div className="mt-10 grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setConfirmingUserApproval(false)}
                            className="px-6 py-5 bg-slate-100 text-slate-600 font-bold rounded-[1.5rem] text-sm hover:bg-slate-200 transition-all active:scale-[0.98]"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirmApprove}
                            className="px-6 py-5 bg-indigo-600 text-white font-bold rounded-[1.5rem] text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98]"
                        >
                            Confirm
                        </button>
                    </div>

                    {/* Footer Label */}
                    <div className="mt-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
                        Identity Verification
                    </div>
                </div>
            </Modal>

            {/* --- REJECT MODAL --- */}
            <Modal show={confirmingUserRejection} onClose={closeRejectionModal} maxWidth="md">
                <form onSubmit={handleConfirmReject} className="text-center">
                    <div className="bg-red-50 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <ChatBubbleLeftEllipsisIcon className="w-8 h-8 text-red-500" />
                    </div>

                    <h2 className="text-xl md:text-2xl font-black text-slate-900">Reject Verification</h2>
                    <p className="mt-4 text-slate-500 font-medium text-sm px-2 text-center leading-relaxed">
                        Please provide a reason for rejecting <span className="font-bold text-slate-900">{userToReject?.full_name}</span>. This will be shown to the user.
                    </p>

                    <div className="mt-6 text-left">
                        <textarea
                            className="w-full rounded-[1.5rem] border-slate-200 focus:border-red-500 focus:ring-red-500 text-sm font-medium p-4 min-h-[120px] bg-slate-50 shadow-inner"
                            placeholder="e.g., ID photo is blurry, expired document, name mismatch..."
                            value={data.reason}
                            onChange={e => setData('reason', e.target.value)}
                            required
                        />
                        {errors.reason && <p className="mt-2 text-xs text-red-600 font-bold ml-2">{errors.reason}</p>}
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={closeRejectionModal}
                            className="px-6 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl text-sm transition-all"
                        >
                            Back
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-4 bg-red-500 text-white font-bold rounded-2xl text-sm shadow-lg shadow-red-100 hover:bg-red-600 transition-all disabled:opacity-50"
                        >
                            {processing ? 'Rejecting...' : 'Reject User'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* --- IMAGE LIGHTBOX --- */}
            {selectedImage && (
                <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-md z-[200] flex items-center justify-center p-4 cursor-zoom-out" onClick={() => setSelectedImage(null)}>
                    <img src={selectedImage} className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain border border-white/10" alt="Full Preview" />
                </div>
            )}
        </AdminLayout>
    );
}