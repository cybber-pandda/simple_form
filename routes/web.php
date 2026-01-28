<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\FormController;
use App\Models\Form;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

/**
 * Public Form View: Accessible to everyone with the link.
 * These handle the rendering of the form and the POST request for data.
 */
Route::get('/f/{slug}', [FormController::class, 'show'])->name('forms.public');
Route::post('/f/{slug}/submit', [FormController::class, 'submit'])->name('forms.submit');

/*
|--------------------------------------------------------------------------
| Authenticated & Verified Routes (Creators)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('forms', FormController::class);
    // --- Unified Dashboard Redirect Logic ---
    Route::get('/dashboard', function () {
        $user = Auth::user();

        // If Role is 1 (Super Admin), redirect them to the Admin Metrics page
        if ($user->role === 1) {
            return redirect()->route('admin.dashboard');
        }

        // Fetch forms with the count of their related submissions
        $forms = Form::where('user_id', $user->id)
            ->withCount('submissions') 
            ->latest()
            ->get();

        // Render the Creator Dashboard with updated stats
        return Inertia::render('Dashboard', [
            'forms'            => $forms,
            'totalForms'       => $forms->count(),
            'activeForms'      => $forms->where('is_active', true)->count(),
            'totalSubmissions' => $forms->sum('submissions_count'), 
        ]);
    })->name('dashboard');

    // --- Form Management ---
    Route::get('/forms/create', [FormController::class, 'create'])->name('forms.create');
    Route::post('/forms', [FormController::class, 'store'])->name('forms.store');
    Route::get('/forms/{form}/edit', [FormController::class, 'edit'])->name('forms.edit');
    
    // --- Submissions View ---
    Route::get('/forms/{form}/submissions', [FormController::class, 'submissions'])->name('forms.submissions');
    
    // --- Profile Management ---
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

/*
|--------------------------------------------------------------------------
| Super Admin Exclusive Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'superadmin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'index'])->name('dashboard');
    Route::get('/users', [AdminController::class, 'users'])->name('users');
    Route::get('/users/create', [AdminController::class, 'create'])->name('users.create');
    Route::get('/roles', [AdminController::class, 'roles'])->name('roles');
    
    Route::post('/users', [AdminController::class, 'store'])->name('users.store');
    Route::patch('/users/{user}', [AdminController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [AdminController::class, 'destroy'])->name('users.destroy');
    Route::patch('/users/{user}/toggle', [AdminController::class, 'toggleStatus'])->name('users.toggle');
});

require __DIR__.'/auth.php';