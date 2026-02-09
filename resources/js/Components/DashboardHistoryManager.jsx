// resources/js/Components/DashboardHistoryManager.jsx

import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';

export default function DashboardHistoryManager({ children }) {
    const { auth, post_login_redirect } = usePage().props;

    useEffect(() => {
        if (!auth?.user) return;

        const loginTimestamp = sessionStorage.getItem('login_timestamp');
        
        // On dashboard load, stamp the history with current session timestamp
        if (loginTimestamp) {
            // Replace current history entry with timestamp
            window.history.replaceState(
                { 
                    page: 'dashboard', 
                    timestamp: parseInt(loginTimestamp),
                    session: loginTimestamp,
                    userRole: auth.user.role // Add user role to history state
                },
                document.title,
                window.location.href
            );
        }

        // If this is a post-login redirect, ensure history is clean
        if (post_login_redirect) {
            window.history.replaceState(
                { 
                    page: 'dashboard', 
                    initial: true,
                    timestamp: parseInt(loginTimestamp),
                    session: loginTimestamp,
                    userRole: auth.user.role
                },
                document.title,
                window.location.href
            );
        }

        // Intercept navigation to old session pages or wrong role pages
        const handlePopState = () => {
            const currentPath = window.location.pathname;
            const logoutTimestamp = sessionStorage.getItem('logout_timestamp');
            const historyState = window.history.state;
            const pageTimestamp = historyState?.timestamp;
            const pageUserRole = historyState?.userRole;
            
            // CRITICAL: Check if role has changed (different user logged in)
            if (pageUserRole !== undefined && pageUserRole !== auth.user.role) {
                // Role mismatch - redirect to correct dashboard for current user
                const correctDashboard = auth.user.role === 1 ? '/admin/dashboard' : '/dashboard';
                window.location.replace(correctDashboard);
                return;
            }
            
            // If this page is from before logout, redirect to current dashboard
            if (logoutTimestamp && pageTimestamp && parseInt(pageTimestamp) < parseInt(logoutTimestamp)) {
                const dashboardRoute = auth.user.role === 1 ? '/admin/dashboard' : '/dashboard';
                window.location.href = dashboardRoute;
                return;
            }

            // Also block restricted paths
            const restrictedPaths = ['/', '/login', '/register', '/forgot-password', '/reset-password'];
            if (restrictedPaths.some(path => currentPath === path || currentPath.startsWith(path + '/'))) {
                const dashboardRoute = auth.user.role === 1 ? '/admin/dashboard' : '/dashboard';
                window.location.href = dashboardRoute;
                return;
            }
            
            // Block admin pages for non-admin users
            if (auth.user.role !== 1 && (currentPath.startsWith('/admin') || currentPath.includes('/admin'))) {
                window.location.replace('/dashboard');
                return;
            }
            
            // Block creator dashboard for admin users
            if (auth.user.role === 1 && currentPath === '/dashboard') {
                window.location.replace('/admin/dashboard');
            }
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [auth, post_login_redirect]);

    return <>{children}</>;
}
