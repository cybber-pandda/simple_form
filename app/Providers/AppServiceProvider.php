<?php

namespace App\Providers;

use Illuminate\Auth\Middleware\RedirectIfAuthenticated;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Customize redirect behavior for authenticated users
        RedirectIfAuthenticated::redirectUsing(function ($request) {
            if (Auth::check()) {
                $user = Auth::user();
                
                // Role-based redirect: Super Admin (role 1) vs Creator (role 0)
                return $user->role === 1 
                    ? route('admin.dashboard') 
                    : route('dashboard');
            }

            return route('dashboard');
        });
    }
}