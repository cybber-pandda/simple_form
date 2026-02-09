// resources/js/Components/LoginPageHistoryManager.jsx

import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';

export default function LoginPageHistoryManager({ children }) {
    const { just_logged_out } = usePage().props;

    useEffect(() => {
        // CRITICAL: When user lands on login after logout, clean up history
        if (just_logged_out) {
            // Set logout timestamp
            sessionStorage.setItem('logout_timestamp', Date.now().toString());
            sessionStorage.setItem('just_logged_out', 'true');
            sessionStorage.removeItem('just_logged_in');
            sessionStorage.removeItem('login_timestamp');
            
            // Replace the entire history with login page
            // This removes ALL previous dashboard/authenticated pages
            window.history.replaceState(
                { page: 'login', postLogout: true, timestamp: Date.now() },
                document.title,
                '/login'
            );
        }

        // Prevent navigating back to ANY authenticated pages after logout
        const handlePopState = () => {
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
                // Immediately redirect to login page (not welcome)
                event.preventDefault();
                window.location.replace('/login');
            }
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [just_logged_out]);

    return <>{children}</>;
}
