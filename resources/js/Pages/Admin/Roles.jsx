import AdminLayout from '@/Layouts/AdminLayout';
import { ShieldCheckIcon, UserGroupIcon, KeyIcon } from '@heroicons/react/24/outline';

export default function Roles() {
    const roles = [
        {
            name: 'Super Admin',
            level: 'Level 1',
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-50',
            description: 'Highest level of access. Can manage all users, view global system metrics, and oversee every form created on the platform.',
            permissions: ['Manage Users', 'View Analytics', 'System Configuration', 'Delete Any Form']
        },
        {
            name: 'Form Creator',
            level: 'Level 2',
            color: 'text-slate-600',
            bgColor: 'bg-slate-100',
            description: 'Standard user access. Can create, edit, and share their own forms and view submissions for those forms.',
            permissions: ['Create Forms', 'Share Forms', 'View Own Submissions', 'Edit Profile']
        }
    ];

    return (
        <AdminLayout header="Roles & Permissions" title="Roles">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {roles.map((role) => (
                    <div key={role.name} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-4 ${role.bgColor} rounded-2xl`}>
                                <ShieldCheckIcon className={`w-8 h-8 ${role.color}`} />
                            </div>
                            <span className="px-4 py-1.5 bg-slate-50 text-slate-400 text-xs font-black uppercase tracking-widest rounded-full">
                                {role.level}
                            </span>
                        </div>

                        <h3 className="text-2xl font-black text-slate-800 mb-3">{role.name}</h3>
                        <p className="text-slate-500 font-medium leading-relaxed mb-8">
                            {role.description}
                        </p>

                        <div className="mt-auto pt-6 border-t border-slate-50">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <KeyIcon className="w-4 h-4" /> Capabilities
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {role.permissions.map((perm) => (
                                    <span key={perm} className="px-3 py-1 bg-slate-50 text-slate-600 text-xs font-bold rounded-lg border border-slate-100">
                                        {perm}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Security Tip Box */}
            <div className="mt-8 p-8 bg-slate-900 rounded-[2.5rem] text-white flex items-center justify-between overflow-hidden relative">
                <div className="relative z-10">
                    <h4 className="text-lg font-bold mb-1 font-bold">Security Enforcement</h4>
                    <p className="text-slate-400 text-sm max-w-md font-medium">
                        Roles are enforced via server-side middleware. Even if UI elements are hidden, unauthorized API requests will be blocked with a 403 error.
                    </p>
                </div>
                <UserGroupIcon className="w-32 h-32 text-white/5 absolute -right-4 -bottom-4" />
            </div>
        </AdminLayout>
    );
}