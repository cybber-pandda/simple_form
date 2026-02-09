<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root view that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user  = $request->user();
        $flash = $request->session()->get('flash') ?? [];

        return [
            ...parent::share($request),

            'auth' => [
                'user' => $user,

                // Bell badge count
                'unread_notifications_count' => $user 
                    ? $user->unreadNotifications()->count() 
                    : 0,

                // Custom mapped notifications (your original logic)
                'notifications' => $user 
                    ? $user->unreadNotifications()->take(5)->get()->map(function ($n) use ($user) {

                        $routeName = array_key_exists('route_name', $n->data)
                            ? $n->data['route_name']
                            : (($user->role === 1) 
                                ? 'admin.verifications.index' 
                                : 'notifications.index');

                        return [
                            'id' => $n->id,
                            'data' => [
                                'title'      => $n->data['title'] ?? 'System Update',
                                'message'    => $n->data['message'] ?? 'A new event has occurred.',
                                'route_name' => $routeName,
                                'params'     => $n->data['params'] ?? [],
                            ],
                            'created_at' => $n->created_at->format('M j, Y • g:i A'),
                            'read_at'    => $n->read_at,
                        ];
                    }) 
                    : [],
            ],

            // 🔥 Added for login/back-button fix
            'post_login_redirect' => fn () => $request->session()->get('post_login_redirect', false),
            'just_logged_out'     => fn () => $request->session()->get('just_logged_out', false),

            // Ziggy routes
            'ziggy' => fn() => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],

            // Flash messages
            'flash' => [
                'message' => fn() => $request->session()->get('message') ?? ($flash['message'] ?? null),
                'id'      => fn() => $request->session()->get('id')      ?? ($flash['id'] ?? null),
                'slug'    => fn() => $request->session()->get('slug')    ?? ($flash['slug'] ?? null),
            ],
        ];
    }
}
