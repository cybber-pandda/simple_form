<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class PreventRoleMismatchAccess
{
    /**
     * Handle an incoming request.
     * 
     * This middleware prevents 403 errors by redirecting users to their correct dashboard
     * when they try to access routes meant for different roles
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Only run for authenticated users
        if (!Auth::check()) {
            return $next($request);
        }

        $user = Auth::user();
        $currentPath = $request->path();

        // If Creator (role !== 1) tries to access admin routes, redirect to creator dashboard
        if ($user->role !== 1 && (str_starts_with($currentPath, 'admin') || str_contains($currentPath, '/admin'))) {
            return redirect()->route('dashboard');
        }

        // If Admin (role === 1) tries to access creator dashboard, redirect to admin dashboard
        if ($user->role === 1 && $currentPath === 'dashboard') {
            return redirect()->route('admin.dashboard');
        }

        return $next($request);
    }
}