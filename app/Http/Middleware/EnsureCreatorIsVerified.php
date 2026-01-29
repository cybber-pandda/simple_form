<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureCreatorIsVerified
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // If user is not logged in or is not approved, block access to form creation
        // We allow Super Admins (role 1) to bypass this check
        if (!$user || ($user->verification_status !== 'approved' && (int)$user->role !== 1)) {
            
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Your account must be approved by an admin.'], 403);
            }

            return redirect()->route('dashboard')->with('error', 'Verification required.');
        }

        return $next($request);
    }
}