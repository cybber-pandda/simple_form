<?php

// app/Http/Controllers/DashboardController.php

namespace App\Http\Controllers;

use App\Models\Form;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Fetch forms with their submission count automatically attached
        $forms = Form::where('user_id', $user->id)
            ->withCount('submissions')
            ->latest()
            ->get();

        return Inertia::render('Dashboard', [
            'forms' => $forms,
            'totalForms' => $forms->count(),
            'activeForms' => $forms->where('is_active', true)->count(),
            'totalSubmissions' => $forms->sum('submissions_count'),
        ]);
    }

    public function metrics()
    {
        $user = Auth::user();

        $topForms = $user->forms()
            ->withCount('submissions')
            ->orderBy('submissions_count', 'desc')
            ->take(3)
            ->get(['id', 'title']);

        return Inertia::render('Metrics/Index', [
            'totalForms' => $user->forms()->count(),
            'totalSubmissions' => $user->submissions()->count(),
            'topForms' => $topForms
        ]);
    }
}
