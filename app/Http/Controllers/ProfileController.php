<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();

        // 1. Fill the basic info (Safe logic for Google vs Traditional)
        if ($user->google_id) {
            // Google users: only update name (email is protected)
            $user->fill($request->safe()->only(['name']));
        } else {
            // Traditional users: update all validated fields
            $user->fill($request->validated());
        }

        // 2. Handle File Upload Logic
        if ($request->hasFile('avatar_file')) {
            // Delete old local avatar if it exists (don't delete if it's a Google/DiceBear URL)
            if ($user->avatar && !str_contains($user->avatar, 'http')) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $user->avatar));
            }

            // Store the new file in 'storage/app/public/avatars'
            $path = $request->file('avatar_file')->store('avatars', 'public');
            
            // Save the public URL (e.g., /storage/avatars/filename.jpg)
            $user->avatar = Storage::url($path);
        }

        // 3. Reset email verification if email changed
        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return Redirect::route('profile.edit')->with('status', 'profile-updated');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $user = $request->user();

        // Use the has_password flag to determine if verification is needed
        $request->validate([
            'password' => $user->has_password ? ['required', 'current_password'] : ['nullable'],
        ]);

        Auth::logout();

        // Delete profile picture from storage if it's a local file
        if ($user->avatar && !str_contains($user->avatar, 'http')) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $user->avatar));
        }

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}