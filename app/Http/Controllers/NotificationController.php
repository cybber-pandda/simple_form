<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\User; // Ensure this is imported

class NotificationController extends Controller
{
    public function index()
    {
        /** @var User $user */
        $user = Auth::user();

        return Inertia::render('Notifications/Index', [
            'notifications' => $user->notifications()->paginate(15)
        ]);
    }

    public function markAllRead()
    {
        /** @var User $user */
        $user = Auth::user();
        $user->unreadNotifications->markAsRead();
        
        return back();
    }

    public function destroy(Request $request)
    {
        $ids = $request->input('ids', []);
        
        if (!empty($ids)) {
            Auth::user()->notifications()->whereIn('id', $ids)->delete();
        }

        return back();
    }

    public function markRead(Request $request)
    {
        $ids = $request->input('ids', []);
        
        if (!empty($ids)) {
            Auth::user()->unreadNotifications()
                ->whereIn('id', $ids)
                ->update(['read_at' => now()]);
        }

        return back();
    }
}