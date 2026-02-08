<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class PasswordController extends Controller
{
    /**
     * Update the user's password.
     */
    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();

        /**
         * Logic: We only allow skipping the 'current_password' check if:
         * 1. The user is a Google user (google_id exists).
         * 2. They haven't established a local password yet (has_password is false).
         */
        $skipCurrentCheck = $user->google_id && !$user->has_password;

        $validated = $request->validate([
            'current_password' => $skipCurrentCheck 
                ? ['nullable'] 
                : ['required', 'current_password'],
            'password' => ['required', Password::defaults(), 'confirmed'],
        ]);

        $user->update([
            'password' => Hash::make($validated['password']),
            // Flip the flag to true so the NEXT time they change it, 
            // they MUST provide the current password for security.
            'has_password' => true, 
        ]);

        return back()->with('status', 'password-updated');
    }
}