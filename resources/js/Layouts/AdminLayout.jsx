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
        { label: 'Verifications', icon: IdentificationIcon, route: 'admin.verifications.index' }, // Added this
        { label: 'Manage Users', icon: UsersIcon, route: 'admin.users' },
        { label: 'Create Account', icon: UserPlusIcon, route: 'admin.users.create' },
        { label: 'Roles', icon: ShieldCheckIcon, route: 'admin.roles' },
    ];

    return (
        <AuthenticatedLayout header={header}>
            <Head title={title} />
            <div className="flex flex-col lg:flex-row gap-8 py-6">
                <aside className="w-full lg:w-64 flex flex-col gap-2">
                    <div className="bg-white p-4 rounded-[2.5rem] border border-slate-100 shadow-sm sticky top-6">
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
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </aside>
                <main className="flex-1 animate-in fade-in duration-500">
                    {children}
                </main>
            </div>
        </AuthenticatedLayout>
    );
}