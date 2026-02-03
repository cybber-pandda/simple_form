<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\FormController;
use App\Http\Controllers\VerificationController; // Import the new controller
use App\Models\Form;
use App\Models\Submission;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Http\Controllers\NotificationController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
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

Route::get('/f/{slug}', [FormController::class, 'show'])->name('forms.public');
Route::post('/f/{slug}/submit', [FormController::class, 'submit'])->name('forms.submit');

/*
|--------------------------------------------------------------------------
| Authenticated & Verified Routes (Creators)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/dashboard', function () {
        $user = Auth::user();
        if ($user->role === 1) return redirect()->route('admin.dashboard');

        $forms = Form::where('user_id', $user->id)->withCount('submissions')->latest()->get();

        return Inertia::render('Dashboard', [
            'forms'            => $forms,
            'totalForms'       => $forms->count(),
            'activeForms'      => $forms->where('is_active', true)->count(),
            'totalSubmissions' => $forms->sum('submissions_count'),
        ]);
    })->name('dashboard');

    Route::get('/metrics', function (Request $request) {
        $user = Auth::user();
        $range = $request->input('range', 'week'); // Default to week

        // Determine the start date based on filter
        $startDate = match ($range) {
            'day'   => Carbon::today(),
            'month' => Carbon::now()->subMonth(),
            'year'  => Carbon::now()->subYear(),
            default => Carbon::now()->subDays(6), // 'week'
        };

        $topForms = Form::where('user_id', $user->id)
            ->withCount(['submissions' => function ($query) use ($startDate) {
                $query->where('created_at', '>=', $startDate);
            }])
            ->orderBy('submissions_count', 'desc')
            ->take(3)
            ->get();

        $trendData = Submission::whereIn('form_id', Form::where('user_id', $user->id)->pluck('id'))
            ->where('created_at', '>=', $startDate)
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as count'))
            ->groupBy('date')
            ->orderBy('date', 'ASC')
            ->get();

        return Inertia::render('Metrics/Index', [
            'totalForms'       => Form::where('user_id', $user->id)->count(),
            'totalSubmissions' => Form::where('user_id', $user->id)->withCount('submissions')->get()->sum('submissions_count'),
            'topForms'         => $topForms,
            'trendData'        => $trendData,
            'currentFilter'    => $range, // Send back to React to keep button active
        ]);
    })->name('metrics.index');

    // --- Notification Routes ---
    Route::get('/notifications', [App\Http\Controllers\NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/mark-read', [App\Http\Controllers\NotificationController::class, 'markAllRead'])->name('notifications.markAllRead');
    Route::post('/notifications/mark-read-selected', [NotificationController::class, 'markRead'])->name('notifications.markRead');
    Route::delete('/notifications/delete-selected', [NotificationController::class, 'destroy'])->name('notifications.destroy');

    // --- New Verification Submission Route ---
    Route::post('/verification/submit', [VerificationController::class, 'store'])->name('verification.store');

    // --- Form Management (Protected by Creator Verification Middleware) ---
    Route::middleware(['creator.verified'])->group(function () {
        Route::resource('forms', FormController::class)->except(['index']);
        Route::get('/forms/create', [FormController::class, 'create'])->name('forms.create');
        Route::post('/forms', [FormController::class, 'store'])->name('forms.store');
        Route::get('/forms/{form}/edit', [FormController::class, 'edit'])->name('forms.edit');
        Route::get('/forms/{form}/submissions', [FormController::class, 'submissions'])->name('forms.submissions');
    });

    // --- Profile Management ---
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // --- Form Management (Protected by Creator Verification Middleware) ---
    Route::middleware(['creator.verified'])->group(function () {
        Route::resource('forms', FormController::class)->except(['index']);
        Route::get('/forms/create', [FormController::class, 'create'])->name('forms.create');
        Route::post('/forms', [FormController::class, 'store'])->name('forms.store');
        Route::get('/forms/{form}/edit', [FormController::class, 'edit'])->name('forms.edit');
        Route::get('/forms/{form}/submissions', [FormController::class, 'submissions'])->name('forms.submissions');
    });
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

    // --- New Admin Verification Review Routes ---
    Route::get('/verifications', [VerificationController::class, 'index'])->name('verifications.index');
    Route::patch('/verifications/{user}', [VerificationController::class, 'update'])->name('verifications.update');

    Route::post('/users', [AdminController::class, 'store'])->name('users.store');
    Route::patch('/users/{user}', [AdminController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [AdminController::class, 'destroy'])->name('users.destroy');
    Route::patch('/users/{user}/toggle', [AdminController::class, 'toggleStatus'])->name('users.toggle');
});

require __DIR__ . '/auth.php';
