<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Notification;
use App\Notifications\AccountStatusUpdated;
use App\Notifications\NewVerificationRequest;

class VerificationController extends Controller
{
    /**
     * Display the pending verifications list.
     * Only accessible by Superadmins (Role 1).
     */
    public function index()
    {
        if (Auth::user()->role !== 1) {
            abort(403, 'Unauthorized access.');
        }

        $pendingUsers = User::where('verification_status', 'pending')
            ->whereNotNull('id_photo_path')
            ->latest()
            ->get();

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

        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Delete old ID photo if it exists to save storage space
        if ($user->id_photo_path) {
            Storage::disk('public')->delete($user->id_photo_path);
        }

        // Store the new ID photo
        $path = $request->file('id_photo')->store('verifications', 'public');

        $user->update([
            'full_name' => $request->full_name,
            'organization' => $request->organization,
            'id_photo_path' => $path,
            'verification_status' => 'pending',
        ]);

        /**
         * NOTIFY SUPERADMINS
         * This triggers the bell icon for Admins. 
         * Ensure NewVerificationRequest has 'mail' removed from its via() method.
         */
        $superAdmins = User::where('role', 1)->get();
        Notification::send($superAdmins, new NewVerificationRequest($user));

        return back()->with('message', 'Your identification has been submitted for review.');
    }

    /**
     * Update verification status (Approve/Reject).
     */
    /**
     * Update verification status (Approve/Reject).
     */
    public function update(Request $request, User $user)
    {
        // 1. Validate the input
        $request->validate([
            'status' => 'required|in:approved,rejected',
            // Reason is required ONLY if the status is rejected
            'reason' => 'required_if:status,rejected|nullable|string|max:1000',
        ]);

        // 2. Prepare update data
        $updateData = [
            'verification_status' => $request->status,
        ];

        // 3. Handle the rejection reason column
        if ($request->status === 'rejected') {
            $updateData['rejection_reason'] = $request->reason;
        } else {
            // Clear the reason if they are now approved
            $updateData['rejection_reason'] = null;
        }

        $user->update($updateData);

        /**
         * NOTIFY THE CREATOR
         * We pass the status and the reason to the notification class
         * so it can be included in the Email and the Database notification.
         */
        $user->notify(new AccountStatusUpdated($request->status, $request->reason));

        return redirect()->route('admin.verifications.index')
            ->with('message', "The user's verification request has been " . $request->status . ".");
    }
}
