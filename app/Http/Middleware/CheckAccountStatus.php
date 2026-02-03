<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class CheckAccountStatus
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    // app/Http/Middleware/CheckAccountStatus.php
    public function handle(Request $request, Closure $next)
    {
        if (Auth::check() && Auth::user()->status === 0) {
            // If it's an Inertia request, we let it pass so the 
            // frontend can show the modal, but you could also 
            // force a logout here if you prefer a hard redirect.
        }
        return $next($request);
    }
}
