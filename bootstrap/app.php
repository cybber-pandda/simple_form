<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\PreventBackToAuth;
use App\Http\Middleware\PreventRoleMismatchAccess;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            // IMPORTANT: Order matters - PreventBackToAuth runs first
            PreventBackToAuth::class,
            // Then PreventRoleMismatchAccess to catch role mismatches BEFORE middleware 403s
            PreventRoleMismatchAccess::class,
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            // This fixes the Target class [creator.verified] does not exist error
            'creator.verified' => \App\Http\Middleware\EnsureCreatorIsVerified::class,
            'superadmin' => \App\Http\Middleware\EnsureUserIsSuperAdmin::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();