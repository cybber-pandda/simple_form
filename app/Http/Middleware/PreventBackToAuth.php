<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class PreventBackToAuth
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // If user is authenticated and trying to access restricted pages, redirect immediately
        if (Auth::check() && $this->isRestrictedPage($request)) {
            $user = Auth::user();
            $dashboardRoute = $user->role === 1 ? 'admin.dashboard' : 'dashboard';
            
            // Use a direct redirect with no caching
            $response = redirect()->route($dashboardRoute);
            $response->headers->set('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
            $response->headers->set('Pragma', 'no-cache');
            $response->headers->set('Expires', '0');
            
            return $response;
        }

        $response = $next($request);

        // CRITICAL: Add no-cache headers to ALL restricted pages AND login page
        // This prevents the browser from showing cached versions via back button
        if ($this->isRestrictedPage($request) || $request->is('/') || $request->is('login')) {
            $response->headers->set('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0, private');
            $response->headers->set('Pragma', 'no-cache');
            $response->headers->set('Expires', '0');
        }

        return $response;
    }

    /**
     * Check if the current request is for a restricted page
     */
    private function isRestrictedPage(Request $request): bool
    {
        // Welcome page - ALWAYS restricted for authenticated users
        if ($request->path() === '/' || $request->is('/')) {
            return true;
        }

        // Auth pages - ALWAYS restricted for authenticated users
        return $request->is('login') || 
               $request->is('register') || 
               $request->is('forgot-password') ||
               $request->is('reset-password') ||
               $request->is('reset-password/*') ||
               $request->is('verify-email') ||
               $request->is('verify-email/*');
    }
}