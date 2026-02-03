<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Form;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail; // Added for email
use App\Mail\WelcomeNewUser;        // Added mailable import
use App\Notifications\AccountStatusUpdated;

class AdminController extends Controller
{
    /**
     * Display the Admin Dashboard with stats.
     */
    public function index()
    {
        return Inertia::render('Admin/Dashboard', [

            // Global counts for the metrics cards
            'totalUsers' => User::count(),
            'totalForms' => Form::count(),

            // Optional: Get the 5 most recent forms across the whole site
            'recentForms' => Form::with('user')->latest()->take(10)->get(),
        ]);
    }

    /**
     * Display the User Directory with search.
     */
    public function users(Request $request)
    {
        $query = User::query();

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%')
                ->orWhere('email', 'like', '%' . $request->search . '%');
        }

        return Inertia::render('Admin/Users/Index', [
            'users' => $query->latest()->get(),
            'filters' => $request->only(['search'])
        ]);
    }

    /**
     * Show the form for creating a new user.
     */
    public function create()
    {
        return Inertia::render('Admin/Users/Create');
    }

    /**
     * Store a newly created user and send welcome email.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users',
            'role'  => 'required|integer',
        ]);

        // Generate a random secure password
        $password = Str::random(12);

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'role'     => $validated['role'],
            'status'   => 1,
            'password' => Hash::make($password),
        ]);

        // NEW FEATURE: Send the Welcome Email via Mailtrap
        Mail::to($user->email)->send(new WelcomeNewUser($user, $password));

        return redirect()->route('admin.users')->with('message', 'User created and credentials sent to email.');
    }

    /**
     * Update the specified user.
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|max:255|unique:users,email,' . $user->id,
            'role'     => 'required|integer',
            'password' => 'nullable|string|min:8',
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        return back()->with('message', 'User updated successfully.');
    }

    /**
     * Remove the user from the system.
     */
    public function destroy(User $user)
    {
        /** @var \App\Models\User $currentUser */
        $currentUser = Auth::user();

        if ($currentUser->is($user)) {
            return back()->with('error', 'You cannot delete your own account.');
        }

        $user->delete();

        return back()->with('message', 'User deleted successfully.');
    }

    /**
     * Toggle status between Active/Inactive.
     */
    public function toggleStatus(User $user)
    {
        if (Auth::id() === $user->id) {
            return back()->with('error', 'You cannot deactivate yourself.');
        }

        // Toggle the status
        $user->status = $user->status === 1 ? 0 : 1;
        $user->save();

        // NEW FEATURE: Trigger Notification
        // If status is 1, account was just activated; if 0, it was deactivated.
        $statusType = $user->status === 1 ? 'activated' : 'deactivated';

        // Notify the user of the change
        $user->notify(new AccountStatusUpdated($statusType));

        return back()->with('message', 'User status updated to ' . $statusType . '.');
    }

    public function roles()
    {
        return Inertia::render('Admin/Roles');
    }
}
