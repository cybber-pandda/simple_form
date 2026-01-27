import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                // 1. Layout: Full width, comfortable padding, and centered alignment
                'flex w-full items-center px-4 py-3.5 ' +
                // 2. Shape: Matching our "Bento" rounded corners
                'rounded-2xl text-sm font-bold tracking-tight transition-all duration-200 ' +
                // 3. State Logic: High-contrast active vs. soft-ghost inactive
                (active
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900') +
                ' ' + className
            }
        >
            {children}
        </Link>
    );
}