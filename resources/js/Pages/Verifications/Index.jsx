import AdminLayout from '@/Layouts/AdminLayout';
import { router } from '@inertiajs/react';
import { CheckBadgeIcon, XCircleIcon, EyeIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';

export default function Index({ pendingUsers = [] }) {
    const [selectedImage, setSelectedImage] = useState(null);

    const handleAction = (userId, status) => {
        const message = status === 'approved' 
            ? "Approve this user? They will gain full access to create forms." 
            : "Reject this user? They will be notified to update their details.";

        if (confirm(message)) {
            router.patch(route('admin.verifications.update', userId), {
                status: status
            });
        }
    };

    return (
        <AdminLayout header="Identity Verifications" title="Verifications">
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {pendingUsers.length === 0 ? (
                    <div className="bg-white p-10 md:p-20 rounded-[2rem] md:rounded-[2.5rem] border border-dashed border-slate-200 text-center">
                        <CheckBadgeIcon className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-900">All caught up!</h3>
                        <p className="text-slate-500 font-medium text-sm">No pending verification requests at the moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {pendingUsers.map((user) => (
                            <div key={user.id} className="bg-white p-5 md:p-7 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col gap-5 md:gap-6 transition-all hover:shadow-md">
                                <div className="flex justify-between items-start gap-2">
                                    <div className="flex items-center gap-3 md:gap-4">
                                        <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-lg">
                                            {user.full_name ? user.full_name.charAt(0) : 'U'}
                                        </div>
                                        <div>
                                            <h3 className="font-black text-slate-900 leading-tight text-sm md:text-base">{user.full_name}</h3>
                                            <p className="text-xs md:text-sm text-slate-500 font-medium">{user.organization}</p>
                                        </div>
                                    </div>
                                    <span className="shrink-0 px-2.5 py-1 bg-amber-50 text-amber-600 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-100">
                                        Pending
                                    </span>
                                </div>

                                {/* ID Image Preview Card */}
                                <div className="relative group aspect-video bg-slate-100 rounded-[1.5rem] overflow-hidden border border-slate-200">
                                    <img 
                                        src={`/storage/${user.id_photo_path}`} 
                                        alt="Identity Document" 
                                        className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                                    />
                                    {/* Overlay - visible on hover for desktop, or tap for mobile */}
                                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                        <button 
                                            onClick={() => setSelectedImage(`/storage/${user.id_photo_path}`)}
                                            className="bg-white text-slate-900 px-4 py-2 md:px-5 md:py-2.5 rounded-xl font-bold text-xs md:text-sm flex items-center gap-2 shadow-2xl hover:scale-105 active:scale-95 transition-all"
                                        >
                                            <EyeIcon className="w-4 h-4 md:w-5 md:h-5" />
                                            View Full ID
                                        </button>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 md:gap-3">
                                    <button 
                                        onClick={() => handleAction(user.id, 'approved')}
                                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 md:py-4 bg-slate-900 text-white text-[11px] md:text-xs font-bold rounded-xl hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200 active:translate-y-0.5"
                                    >
                                        <CheckBadgeIcon className="w-4 h-4" />
                                        Approve
                                    </button>

                                    <button 
                                        onClick={() => handleAction(user.id, 'rejected')}
                                        className="inline-flex items-center gap-2 px-4 py-3 md:py-4 bg-white border border-slate-100 text-red-500 text-[11px] md:text-xs font-bold rounded-xl hover:bg-red-50 hover:border-red-100 transition-all shadow-sm active:translate-y-0.5"
                                    >
                                        <XCircleIcon className="w-4 h-4" />
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Fullscreen Image Lightbox */}
            {selectedImage && (
                <div 
                    className="fixed inset-0 bg-slate-900/95 backdrop-blur-md z-[200] flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in zoom-in duration-200"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-w-5xl w-full h-full flex items-center justify-center">
                        <img 
                            src={selectedImage} 
                            className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain border border-white/10" 
                            alt="Full Identity Preview" 
                        />
                        <button 
                            className="absolute top-0 right-0 m-4 text-white/50 hover:text-white transition-colors"
                            onClick={() => setSelectedImage(null)}
                        >
                            <XCircleIcon className="w-10 h-10 md:w-12 md:h-12" />
                        </button>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}