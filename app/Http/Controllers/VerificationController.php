<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Notifications\AccountStatusUpdated;

class VerificationController extends Controller
{
    /**
     * Display the pending verifications list.
     * Rendering path updated to match your file structure.
     */
    public function index()
    {
        // Only allow admins to view this list
        if (Auth::user()->role !== 1) {
            abort(403, 'Unauthorized access.');
        }

        // Fetch users who have submitted an ID photo and are pending
        $pendingUsers = User::where('verification_status', 'pending')
            ->whereNotNull('id_photo_path')
            ->latest()
            ->get();

        // Fix: Render path matches resources/js/Pages/Verifications/Index.jsx
        return Inertia::render('Verifications/Index', [
            'pendingUsers' => $pendingUsers
        ]);
    }

    /**
     * Store a new verification request from a Creator.
     */
    public function store(Request $request)
    {
        $request->validate([
            'full_name' => 'required|string|max:255',
            'organization' => 'required|string|max:255',
            'id_photo' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $user = Auth::user();

        // Clean up old ID if it exists
        if ($user->id_photo_path) {
            Storage::disk('public')->delete($user->id_photo_path);
        }

        $path = $request->file('id_photo')->store('verifications', 'public');

        $user->update([
            'full_name' => $request->full_name,
            'organization' => $request->organization,
            'id_photo_path' => $path,
            'verification_status' => 'pending',
        ]);

        return back()->with('message', 'Identification submitted for review.');
    }

    /**
     * Update verification status (Approve/Reject).
     */
    public function update(Request $request, User $user)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected',
        ]);

        $user->update([
            'verification_status' => $request->status,
        ]);

        // Trigger the Notification to the user being reviewed
        $user->notify(new AccountStatusUpdated($request->status));

        return redirect()->route('admin.verifications.index')
            ->with('message', "User has been " . ucfirst($request->status) . ".");
    }
}
