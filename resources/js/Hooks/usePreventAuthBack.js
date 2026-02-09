// resources/js/Hooks/usePreventAuthBack.js

import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';

export function usePreventAuthBack() {
    const { auth } = usePage().props;

    useEffect(() => {
        // Only run if user is authenticated
        if (!auth?.user) return;

        const dashboardRoute = auth.user.role === 1 ? '/admin/dashboard' : '/dashboard';
        const loginTimestamp = sessionStorage.getItem('login_timestamp');
        const logoutTimestamp = sessionStorage.getItem('logout_timestamp');
        const currentPath = window.location.pathname;

        // Clear any old logout timestamp if this is a fresh login
        if (loginTimestamp && logoutTimestamp && parseInt(loginTimestamp) > parseInt(logoutTimestamp)) {
            sessionStorage.removeItem('logout_timestamp');
            sessionStorage.removeItem('just_logged_out');
        }

        // IMMEDIATE CHECK: If current user is on wrong dashboard, redirect NOW
        // This runs immediately when the hook mounts, not just on back button
        if (auth.user.role !== 1 && (currentPath.startsWith('/admin') || currentPath.includes('/admin'))) {
            // Creator on admin page - redirect immediately
            console.log('Creator detected on admin page, redirecting to /dashboard');
            window.location.replace('/dashboard');
            return;
        }
        
        if (auth.user.role === 1 && currentPath === '/dashboard') {
            // Admin on creator dashboard - redirect immediately
            console.log('Admin detected on creator dashboard, redirecting to /admin/dashboard');
            window.location.replace('/admin/dashboard');
            return;
        }

        // Handle popstate to catch back button navigation
        const handlePopState = () => {
            const newPath = window.location.pathname;
            
            console.log('Popstate detected, new path:', newPath, 'User role:', auth.user.role);
            
            // List of restricted paths for authenticated users
            const restrictedPaths = ['/', '/login', '/register', '/forgot-password', '/reset-password'];
            
            // If we're on a restricted path, redirect immediately
            if (restrictedPaths.some(path => newPath === path || newPath.startsWith(path + '/'))) {
                console.log('Restricted path detected, redirecting to:', dashboardRoute);
                window.location.href = dashboardRoute;
                return;
            }
            
            // CRITICAL: Check if current user is trying to access admin routes but is not admin
            if (auth.user.role !== 1 && (newPath.startsWith('/admin') || newPath.includes('/admin'))) {
                // User is Creator but trying to access admin page - redirect to creator dashboard
                console.log('Creator trying to access admin via back button, redirecting to /dashboard');
                window.location.replace('/dashboard');
                return;
            }
            
            // CRITICAL: Check if current user is admin but trying to access creator dashboard
            if (auth.user.role === 1 && newPath === '/dashboard') {
                // User is Admin but trying to access creator dashboard - redirect to admin dashboard
                console.log('Admin trying to access creator dashboard via back button, redirecting to /admin/dashboard');
                window.location.replace('/admin/dashboard');
                return;
            }
            
            // Check if the page we're navigating to is from a previous session
            const historyState = window.history.state;
            const pageTimestamp = historyState?.timestamp;
            
            if (logoutTimestamp && pageTimestamp && parseInt(pageTimestamp) < parseInt(logoutTimestamp)) {
                // This page is from before logout - redirect to current dashboard
                console.log('Old session page detected, redirecting to:', dashboardRoute);
                window.location.href = dashboardRoute;
            }
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [auth]);
}