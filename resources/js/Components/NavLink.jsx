import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                // 1. Layout: Centered items with a consistent height
                'inline-flex items-center px-4 py-2 ' +
                // 2. Shape: Rounded-xl for a softer, modern profile
                'rounded-xl text-sm font-bold tracking-tight transition-all duration-200 ' +
                // 3. State Logic: 
                // Active: Subtle Indigo tint with bold text
                // Inactive: Ghost style with slate text
                (active
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900') +
                ' ' + className
            }
        >
            {children}
        </Link>
    );
}