import React, { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';

export default function NotificationToast({ count }) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        // 1. Check if we have unread items
        // 2. Check if we've already shown this toast in the current browser session
        const alreadyShown = sessionStorage.getItem('notification_toast_shown');

        if (count > 0 && !alreadyShown) {
            // Show after 1 second
            const timer = setTimeout(() => {
                setShow(true);
                // Mark as shown so it doesn't pop up on every page change
                sessionStorage.setItem('notification_toast_shown', 'true');
            }, 1000);

            // AUTO-REMOVE after 5 seconds of being visible
            const autoDismiss = setTimeout(() => {
                setShow(false);
            }, 6000); // 1s delay + 5s visibility

            return () => {
                clearTimeout(timer);
                clearTimeout(autoDismiss);
            };
        }
    }, [count]);

    if (!show) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[100] animate-in slide-in-from-right-10 fade-out duration-500">
            <div className="bg-white/90 backdrop-blur-xl border border-indigo-100 shadow-2xl shadow-indigo-200/50 rounded-2xl p-4 flex items-center gap-4 max-w-sm">
                <div className="h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-200">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                </div>
                
                <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900">New Responses!</p>
                    <p className="text-xs text-slate-500 font-medium leading-tight">You have {count} unread form submissions.</p>
                </div>

                <div className="flex flex-col gap-1 border-l border-slate-100 pl-4">
                    <Link 
                        href={route('notifications.index')} 
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                    >
                        View
                    </Link>
                    <button 
                        onClick={() => setShow(false)}
                        className="text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-tighter"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}