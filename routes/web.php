<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// --- Dynamic Dashboard Logic ---
Route::get('/dashboard', function () {
    $user = auth()->user();

    if ($user->role === 1) {
        return Inertia::render('Admin/Dashboard'); 
    }

    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// --- Standard Authenticated Routes ---
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// --- Super Admin Exclusive Routes ---
Route::middleware(['auth', 'superadmin'])->group(function () {
    // Admin specific logic will go here
});

Route::middleware(['auth', 'superadmin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'index'])->name('dashboard');
    Route::get('/users', [AdminController::class, 'users'])->name('users');
    Route::get('/users/create', [AdminController::class, 'create'])->name('users.create');
    Route::get('/roles', [AdminController::class, 'roles'])->name('roles');
    Route::patch('/users/{user}', [AdminController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [AdminController::class, 'destroy'])->name('users.destroy');
    Route::post('/users', [AdminController::class, 'store'])->name('users.store');
    Route::patch('/users/{user}/toggle', [AdminController::class, 'toggleStatus'])->name('users.toggle');
});

require __DIR__.'/auth.php';