import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import NotificationToast from '@/Components/NotificationToast';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    // Access auth data from updated Middleware
    const { auth } = usePage().props;
    const user = auth.user;
    const unreadCount = auth.unread_notifications_count;
    const notifications = auth.notifications || []; 

    // Logic for roles and status
    const isDeactivated = user.status === 0;
    const isSuperAdmin = user.role === 1; 
    
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50/50">
            {/* --- ACCOUNT DEACTIVATED MODAL --- */}
            {isDeactivated && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-md px-4">
                    <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full text-center shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="mx-auto w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                            <svg className="w-10 h-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0 0v2m0-2h2m-2 0H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        
                        <h2 className="text-2xl font-black text-slate-900 mb-2">Account Restricted</h2>
                        <p className="text-slate-500 mb-8 leading-relaxed">
                            Your account has been deactivated by an administrator. You no longer have access to this dashboard.
                        </p>

                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                        >
                            Sign Out & Close
                        </Link>
                    </div>
                </div>
            )}

            {/* Navigation: Sticky with glass effect */}
            <nav className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-20 justify-between"> 
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href={route('dashboard')} className="transition-transform hover:scale-105 active:scale-95">
                                    <ApplicationLogo className="block h-10 w-auto" />
                                </Link>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden sm:ms-6 sm:flex sm:items-center gap-4">
                            
                            {/* --- UNIFIED NOTIFICATION CENTER --- */}
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="relative group p-2 rounded-xl text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200">
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                        </svg>
                                        {unreadCount > 0 && (
                                            <span className="absolute top-1.5 right-1.5 flex h-4 w-4">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-600 text-[9px] font-bold text-white items-center justify-center ring-2 ring-white">
                                                    {unreadCount}
                                                </span>
                                            </span>
                                        )}
                                    </button>
                                </Dropdown.Trigger>

                                <Dropdown.Content width="80" align="right" contentClasses="py-0 bg-white overflow-hidden rounded-[2rem] shadow-2xl border-slate-100">
                                    <div className="p-5 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Notifications</h3>
                                        <Link href={route('notifications.index')} className="text-[9px] font-bold text-indigo-600 hover:underline">VIEW ALL</Link>
                                    </div>

                                    <div className="max-h-[350px] overflow-y-auto">
                                        {notifications.length > 0 ? (
                                            notifications.map((n) => (
                                                <Link 
                                                    key={n.id} 
                                                    href={n.data.route_name ? route(n.data.route_name) : route('notifications.index')}
                                                    className="block p-4 hover:bg-slate-50 border-b border-slate-50 transition-colors group/item"
                                                >
                                                    <div className="flex gap-4">
                                                        <div className="h-10 w-10 shrink-0 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover/item:bg-indigo-600 group-hover/item:text-white transition-all">
                                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-bold text-slate-900">{n.data.title}</p>
                                                            <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5 line-clamp-2">{n.data.message}</p>
                                                            <p className="text-[9px] font-black text-slate-300 uppercase mt-2 tracking-tighter">{n.created_at}</p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))
                                        ) : (
                                            <div className="p-10 text-center">
                                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">All caught up</p>
                                            </div>
                                        )}
                                    </div>

                                    <Link 
                                        href={isSuperAdmin ? route('admin.verifications.index') : route('notifications.index')}
                                        className="block w-full p-4 text-center text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:bg-slate-50 border-t border-slate-50 transition-colors"
                                    >
                                        {isSuperAdmin ? 'Manage Verifications' : 'View All Notifications'}
                                    </Link>
                                </Dropdown.Content>
                            </Dropdown>

                            {/* User Profile Dropdown */}
                            <div className="relative ms-2">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button
                                            type="button"
                                            className="inline-flex items-center gap-2 rounded-2xl border border-transparent bg-slate-50 px-4 py-2 text-sm font-bold text-slate-600 transition-all hover:bg-slate-100 focus:outline-none"
                                        >
                                            <div className="h-6 w-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px]">
                                                {user.name.charAt(0)}
                                            </div>
                                            {user.name}
                                            <svg className="h-4 w-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content width="56">
                                        <div className="px-4 py-2 border-b border-slate-50 mb-1">
                                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Account</p>
                                        </div>
                                        <Dropdown.Link href={route('profile.edit')}>Profile Settings</Dropdown.Link>
                                        <Dropdown.Link href={route('notifications.index')}>Notifications</Dropdown.Link>
                                        <div className="border-t border-slate-50 my-1"></div>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            Sign Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* Mobile Navigation Controls */}
                        <div className="-me-2 flex items-center sm:hidden gap-1">
                            <Link href={route('notifications.index')} className="relative p-2 text-slate-500">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                {unreadCount > 0 && (
                                    <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-indigo-600 ring-2 ring-white"></span>
                                )}
                            </Link>
                            
                            <button
                                onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                className="inline-flex items-center justify-center rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 focus:outline-none transition-colors"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    <path className={showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- FLOATING MOBILE MENU --- */}
                {/* Changed to absolute positioning to float over the main content */}
                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden absolute top-[5.5rem] left-4 right-4 z-[60]'}>
                    <div className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-slate-200/60 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="px-6 py-6 border-b border-slate-100 bg-slate-50/50">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-lg">
                                    {user.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="font-black text-slate-900 leading-tight">{user.name}</div>
                                    <div className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-1">{user.email}</div>
                                </div>
                            </div>
                        </div>

                        <div className="p-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')} active={route().current('profile.edit')}>
                                Profile Settings
                            </ResponsiveNavLink>
                            <ResponsiveNavLink href={route('notifications.index')} active={route().current('notifications.index')}>
                                Notifications
                            </ResponsiveNavLink>
                            
                            <div className="border-t border-slate-100 my-2 mx-4"></div>
                            
                            <ResponsiveNavLink method="post" href={route('logout')} as="button" className="text-red-600 font-black">
                                Sign Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Header Section */}
            {header && (
                <header className="bg-transparent">
                    <div className="mx-auto max-w-7xl px-4 pt-10 pb-6 sm:px-6 lg:px-8">
                        <div className="text-3xl font-bold tracking-tight text-slate-900">
                            {header}
                        </div>
                    </div>
                </header>
            )}

            {/* Main Content Area */}
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
                {children}
            </main>
            
            <NotificationToast count={unreadCount} />
        </div>
    );
}