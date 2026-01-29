<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SuperAdminMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if user is logged in and has role 1
        if (!$request->user() || (int)$request->user()->role !== 1) {
            abort(403, 'Unauthorized action.');
        }

        return $next($request);
    }
}