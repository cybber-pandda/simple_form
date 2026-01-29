import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import React from 'react';

export default function Verifications({ pendingUsers }) {
    const handleAction = (id, status) => {
        router.patch(route('admin.verifications.update', id), { status });
    };

    return (
        <AuthenticatedLayout header="Pending Creator Verifications">
            <Head title="Admin Verifications" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Creator</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ID Document</th>
                                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {pendingUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-gray-900">{user.full_name}</div>
                                            <div className="text-sm text-gray-500">{user.organization}</div>
                                            <div className="text-xs text-gray-400">{user.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <a href={`/storage/${user.id_photo_path}`} target="_blank" className="text-indigo-600 hover:underline text-sm font-bold">
                                                View ID Photo
                                            </a>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button 
                                                onClick={() => handleAction(user.id, 'approved')}
                                                className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-emerald-600"
                                            >
                                                Approve
                                            </button>
                                            <button 
                                                onClick={() => handleAction(user.id, 'rejected')}
                                                className="bg-red-500 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-600"
                                            >
                                                Reject
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {pendingUsers.length === 0 && <p className="text-center py-10 text-gray-500">No pending verifications.</p>}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}