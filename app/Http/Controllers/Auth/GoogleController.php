<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str; 
use Illuminate\Http\Request;

class GoogleController extends Controller
{
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            // Retrieve user data from Google
            $googleUser = Socialite::driver('google')->user();
        } catch (\Exception $e) {
            return redirect('/login')->with('error', 'Google Sign-in timed out.');
        }

        // 1. Find User by email
        $user = User::where('email', $googleUser->email)->first();

        if ($user) {
            /**
             * EXISTING USER LOGIC
             * We update the avatar ONLY if they don't have one, 
             * or if their current one is still a Google/DiceBear URL.
             * This prevents overwriting custom uploaded files.
             */
            $currentAvatar = $user->avatar;
            $isExternal = !$currentAvatar || 
                          str_contains($currentAvatar, 'googleusercontent.com') || 
                          str_contains($currentAvatar, 'dicebear.com');

            $updateData = [
                'google_id' => $googleUser->id,
                'has_password' => $user->password ? true : false,
            ];

            // Only sync the Google photo if they haven't uploaded a custom one
            if ($isExternal) {
                $updateData['avatar'] = $googleUser->getAvatar();
            }

            $user->update($updateData);

        } else {
            /**
             * NEW USER LOGIC
             */
            $isAdminEmail = ($googleUser->email === 'your-admin@email.com');

            $user = User::create([
                'name'                => $googleUser->name,
                'email'               => $googleUser->email,
                'google_id'           => $googleUser->id,
                'avatar'              => $googleUser->getAvatar(), 
                'password'            => bcrypt(Str::random(16)), 
                'has_password'        => false, 
                'role'                => $isAdminEmail ? 1 : 0, 
                'is_admin'            => $isAdminEmail,
                'status'              => 1, 
                'verification_status' => $isAdminEmail ? 'approved' : 'pending',
            ]);
        }

        // 2. Status check
        if ($user->status == 0) {
            return redirect()->route('login')->with('status', 'This account has been deactivated by an admin.');
        }

        // 3. Login and session security
        Auth::login($user);
        request()->session()->regenerate(); 

        // 4. Smart Redirect
        return $user->role === 1 
            ? redirect()->route('admin.dashboard') 
            : redirect()->intended('/dashboard');
    }
}