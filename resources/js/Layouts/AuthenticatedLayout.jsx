import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        // 1. Background: Using a cooler slate-50 instead of standard gray-100
        <div className="min-h-screen bg-slate-50/50">
            {/* 2. Navigation: Sticky with glass effect (backdrop-blur) */}
            <nav className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-20 justify-between"> {/* Increased height for airiness */}
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="dashboard" className="transition-transform hover:scale-105 active:scale-95">
                                    <ApplicationLogo className="block h-10 w-auto" />
                                </Link>
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button
                                            type="button"
                                            className="inline-flex items-center gap-2 rounded-2xl border border-transparent bg-slate-50 px-4 py-2 text-sm font-bold text-slate-600 transition-all hover:bg-slate-100 focus:outline-none"
                                        >
                                            {/* Optional: Add a small user avatar placeholder here */}
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
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            Sign Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* Mobile Hamburger Menu */}
                        <div className="-me-2 flex items-center sm:hidden">
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

                {/* Mobile Navigation Dropdown */}
                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden border-t border-slate-100 bg-white'}>

                    <div className="border-t border-slate-100 pb-1 pt-4 px-2">
                        <div className="px-4 mb-3">
                            <div className="text-base font-bold text-slate-800">{user.name}</div>
                            <div className="text-sm font-medium text-slate-500">{user.email}</div>
                        </div>
                        <div className="space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>Profile Settings</ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route('logout')} as="button">Sign Out</ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {/* 3. Header Section: Clean, bold typography */}
            {header && (
                <header className="bg-transparent">
                    <div className="mx-auto max-w-7xl px-4 pt-10 pb-6 sm:px-6 lg:px-8">
                        <div className="text-3xl font-bold tracking-tight text-slate-900">
                            {header}
                        </div>
                    </div>
                </header>
            )}

            {/* 4. Main Content Area */}
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
                {children}
            </main>
        </div>
    );
}