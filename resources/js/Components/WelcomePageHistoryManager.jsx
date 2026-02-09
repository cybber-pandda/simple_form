// resources/js/Components/WelcomePageHistoryManager.jsx

import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';

export default function WelcomePageHistoryManager({ children }) {
    const { just_logged_out } = usePage().props;

    useEffect(() => {
        // CRITICAL: Clear all authenticated pages from history when user logs out
        if (just_logged_out) {
            // Set a timestamp for when logout occurred
            sessionStorage.setItem('logout_timestamp', Date.now().toString());
            sessionStorage.setItem('just_logged_out', 'true');
            sessionStorage.removeItem('just_logged_in');
            
            // Replace the entire history stack with just the Welcome page
            // This removes ALL previous dashboard/authenticated pages
            window.history.replaceState(
                { page: 'welcome', cleared: true, timestamp: Date.now() },
                document.title,
                '/'
            );
        }

        // Prevent navigating back to ANY authenticated pages after logout
        const handlePopState = (event) => {
            const currentPath = window.location.pathname;
            const logoutTimestamp = sessionStorage.getItem('logout_timestamp');
            
            // List of all authenticated paths
            const authenticatedPaths = [
                '/dashboard',
                '/admin',
                '/profile',
                '/forms',
                '/metrics',
                '/notifications',
                '/verification'
            ];
            
            // If trying to go to an authenticated page after logout
            const isAuthenticatedPage = authenticatedPaths.some(path => 
                currentPath.startsWith(path) || currentPath.includes(path)
            );
            
            if (isAuthenticatedPage && logoutTimestamp) {
                // Immediately redirect to welcome page
                event.preventDefault();
                window.location.replace('/');
            }
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [just_logged_out]);

    return <>{children}</>;
}
