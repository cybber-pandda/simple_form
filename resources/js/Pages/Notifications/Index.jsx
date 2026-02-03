import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { BellIcon, CheckCircleIcon, InboxIcon } from '@heroicons/react/24/outline';

export default function Index({ notifications, unreadCount }) {
    
    const markAsRead = (id) => {
        router.post(route('notifications.read', id), {}, {
            preserveScroll: true,
        });
    };

    const markAllAsRead = () => {
        router.post(route('notifications.readAll'), {}, {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout header="Notifications">
            <Head title="Notifications" />

            <div className="py-12 bg-slate-50/50 min-h-screen">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Header Section */}
                    <div className="flex items-end justify-between mb-10">
                        <div>
                            <h3 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-2">System Alerts</h3>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Notifications</h2>
                        </div>
                        {unreadCount > 0 && (
                            <button 
                                onClick={markAllAsRead}
                                className="text-[10px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors flex items-center gap-2"
                            >
                                <CheckCircleIcon className="w-4 h-4" /> Mark all as read
                            </button>
                        )}
                    </div>

                    {/* Notifications List */}
                    <div className="space-y-4">
                        {notifications.length > 0 ? (
                            notifications.map((n) => (
                                <div 
                                    key={n.id} 
                                    onClick={() => !n.read_at && markAsRead(n.id)}
                                    className={`group relative p-6 rounded-[2rem] border transition-all cursor-pointer ${
                                        n.read_at 
                                        ? 'bg-white border-slate-100 opacity-75 hover:opacity-100' 
                                        : 'bg-white border-indigo-100 shadow-md ring-1 ring-indigo-50'
                                    }`}
                                >
                                    <div className="flex gap-4">
                                        <div className={`p-3 rounded-2xl ${n.read_at ? 'bg-slate-50 text-slate-400' : 'bg-indigo-50 text-indigo-600'}`}>
                                            <BellIcon className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">
                                                    {n.data.type || 'System'}
                                                </p>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase italic">
                                                    {new Date(n.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <h4 className="font-bold text-slate-900 mb-1">{n.data.title}</h4>
                                            <p className="text-sm text-slate-600 leading-relaxed">{n.data.message}</p>
                                        </div>
                                    </div>
                                    
                                    {!n.read_at && (
                                        <div className="absolute top-6 right-6 w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
                                <InboxIcon className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                <p className="text-slate-400 font-black italic uppercase tracking-widest text-sm">Inbox is empty</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}