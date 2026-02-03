<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        // Get the flash data from the session
        $flash = $request->session()->get('flash') ?? [];

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
                // ADD THIS LINE:
                'unread_notifications_count' => $request->user()
                    ? $request->user()->unreadNotifications()->count()
                    : 0,
            ],
            'ziggy' => fn() => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'flash' => [
                'message' => fn() => $request->session()->get('message') ?? ($flash['message'] ?? null),
                'id'      => fn() => $request->session()->get('id')      ?? ($flash['id'] ?? null),
                'slug'    => fn() => $request->session()->get('slug')    ?? ($flash['slug'] ?? null),
            ],
        ];
    }
}