<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PreventDashboardCache
{
    /**
     * Handle an incoming request.
     * 
     * This middleware prevents browser caching of dashboard pages
     * so that after logout, the back button cannot show cached dashboard content
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Add AGGRESSIVE no-cache headers to prevent ANY caching
        // This prevents the dashboard flash/flicker when pressing back after logout
        $response->headers->set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0, post-check=0, pre-check=0');
        $response->headers->set('Pragma', 'no-cache');
        $response->headers->set('Expires', '0');
        
        // Additional headers to prevent caching
        $response->headers->set('Last-Modified', gmdate('D, d M Y H:i:s') . ' GMT');
        
        return $response;
    }
}