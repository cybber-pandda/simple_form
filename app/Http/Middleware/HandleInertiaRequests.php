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
        $user = $request->user();
        $flash = $request->session()->get('flash') ?? [];

        return [
            ...parent::share($request),
            
            'auth' => [
                'user' => $user,
                
                // Returns the total number of unread alerts for the bell badge
                'unread_notifications_count' => $user 
                    ? $user->unreadNotifications()->count() 
                    : 0,

                /**
                 * DYNAMIC NOTIFICATIONS
                 * Available for all authenticated users with readable timestamps.
                 */
                'notifications' => $user 
                    ? $user->unreadNotifications()->take(5)->get()->map(function ($n) use ($user) {
                        
                        /**
                         * LOGIC:
                         * 1. Check if 'route_name' exists in the notification's database JSON.
                         * 2. If it exists but is NULL (like in Account Updates), we keep it NULL.
                         * 3. If the key doesn't exist at all, then we apply the fallback route.
                         */
                        $routeName = array_key_exists('route_name', $n->data) 
                            ? $n->data['route_name'] 
                            : (($user->role === 1) ? 'admin.verifications.index' : 'notifications.index');

                        return [
                            'id' => $n->id,
                            'data' => [
                                'title'      => $n->data['title'] ?? 'System Update',
                                'message'    => $n->data['message'] ?? 'A new event has occurred.',
                                'route_name' => $routeName,
                                'params'     => $n->data['params'] ?? [], // Pass through any route parameters (like submission ID)
                            ],
                            // Readable format (Feb 4, 2026 • 5:05 AM)
                            'created_at' => $n->created_at->format('M j, Y • g:i A'),
                            'read_at'    => $n->read_at,
                        ];
                    }) 
                    : [],
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