<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Form;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\WelcomeNewUser;
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

            // Get the 10 most recent forms across the whole site
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
            'status'   => 1, // Created as Active
            'password' => Hash::make($password),
        ]);

        // Send the Welcome Email (Credentials)
        Mail::to($user->email)->send(new WelcomeNewUser($user, $password));

        // Also add a "Welcome" notification to their in-app bell icon
        $user->notify(new AccountStatusUpdated('activated'));

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

        // Toggle the status (1 = Active, 0 = Inactive)
        $user->status = $user->status === 1 ? 0 : 1;
        $user->save();

        // Determine notification type
        $statusType = $user->status === 1 ? 'activated' : 'deactivated';

        // Notify the user via Email and Database (Bell Icon)
        $user->notify(new AccountStatusUpdated($statusType));

        return back()->with('message', 'User account has been ' . $statusType . '.');
    }

    /**
     * Display Roles page.
     */
    public function roles()
    {
        return Inertia::render('Admin/Roles');
    }
}