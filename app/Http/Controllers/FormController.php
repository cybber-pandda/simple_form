<?php

namespace App\Http\Controllers;

use App\Models\Form;
use App\Models\Submission; // Ensure you have a Submission model
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class FormController extends Controller
{
    public function create()
    {
        return Inertia::render('Forms/Builder');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'  => 'required|string|max:255',
            'schema' => 'required|array', 
        ]);

        Form::create([
            'user_id' => Auth::id(),
            'title'   => $validated['title'],
            'slug'    => Str::slug($validated['title']) . '-' . Str::random(5),
            'schema'  => $validated['schema'],
            'is_active' => true,
        ]);

        return redirect()->route('dashboard')->with('message', 'Form created successfully!');
    }

    public function show($slug)
    {
        $form = Form::where('slug', $slug)->where('is_active', true)->firstOrFail();

        return Inertia::render('Forms/PublicView', [
            'form' => $form
        ]);
    }

    /**
     * Handle the Public Submission
     */
    public function submit(Request $request, $slug)
    {
        $form = Form::where('slug', $slug)->where('is_active', true)->firstOrFail();

        // We save the entire request payload into a JSON column
        // You'll need a submissions table with: form_id and data (json)
        $form->submissions()->create([
            'data' => $request->all(),
            'ip_address' => $request->ip(),
        ]);

        return back()->with('message', 'Form submitted successfully! Thank you.');
    }

    public function submissions(Form $form)
    {
        // Check ownership
        if ($form->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('Forms/Submissions', [
            'form' => $form,
            'submissions' => $form->submissions()->latest()->paginate(20)
        ]);
    }

    /**
     * Load the form back into the builder for editing
     */
    public function edit(Form $form)
    {
        // Ensure the user owns the form
        if ($form->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('Forms/Builder', [
            'form' => $form
        ]);
    }
}