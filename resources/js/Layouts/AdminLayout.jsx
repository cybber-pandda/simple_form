import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    ChartBarIcon, 
    UsersIcon, 
    UserPlusIcon, 
    ShieldCheckIcon,
    IdentificationIcon 
} from '@heroicons/react/24/outline';

export default function AdminLayout({ children, header, title }) {
    const isRoute = (name) => route().current(name);

    const navItems = [
        { label: 'Metrics', icon: ChartBarIcon, route: 'admin.dashboard' },
        { label: 'Verifications', icon: IdentificationIcon, route: 'admin.verifications.index' },
        { label: 'Users', icon: UsersIcon, route: 'admin.users' }, 
        { label: 'Create', icon: UserPlusIcon, route: 'admin.users.create' }, 
        { label: 'Roles', icon: ShieldCheckIcon, route: 'admin.roles' },
    ];

    return (
        <AuthenticatedLayout header={header}>
            <Head title={title} />
            
            <div className="flex flex-col lg:flex-row gap-8 pt-2 pb-6 px-4 sm:px-6 lg:px-8">
                {/* --- Desktop Sidebar (Now Sticky) --- */}
                <aside className="hidden lg:block w-64 flex-shrink-0">
                    {/* Added sticky and top-24 (adjust top-24 based on your AuthenticatedLayout header height) */}
                    <div className="bg-white p-4 rounded-[2.5rem] border border-slate-100 shadow-sm sticky top-24">
                        <nav className="space-y-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.route}
                                    href={route(item.route)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                                        isRoute(item.route)
                                            ? 'bg-indigo-50 text-indigo-600'
                                            : 'text-slate-500 hover:bg-slate-50'
                                    }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.label === 'Users' ? 'Manage Users' : item.label === 'Create' ? 'Create Account' : item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </aside>

                {/* --- Main Content Area --- */}
                <main className="flex-1 pb-24 lg:pb-0 animate-in fade-in duration-500">
                    {children}
                </main>

                {/* --- Mobile Sticky Bottom Bar --- */}
                <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
                    <div className="bg-white/80 backdrop-blur-lg border border-slate-200 shadow-2xl rounded-2xl flex justify-around items-center p-2 backdrop-saturate-150">
                        {navItems.map((item) => {
                            const active = isRoute(item.route);
                            return (
                                <Link
                                    key={item.route}
                                    href={route(item.route)}
                                    className={`flex flex-col items-center justify-center flex-1 py-2 rounded-xl transition-all duration-300 relative ${
                                        active ? 'text-indigo-600 scale-110' : 'text-slate-400'
                                    }`}
                                >
                                    <item.icon className={`w-6 h-6 transition-transform ${active ? '-translate-y-1' : ''}`} />
                                    <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">
                                        {item.label}
                                    </span>
                                    
                                    {active && (
                                        <div className="absolute -bottom-1 w-1 h-1 bg-indigo-600 rounded-full shadow-[0_0_8px_rgba(79,70,229,0.6)]" />
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </nav>
            </div>
        </AuthenticatedLayout>
    );
}