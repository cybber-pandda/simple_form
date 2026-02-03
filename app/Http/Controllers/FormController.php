<?php

namespace App\Http\Controllers;

use App\Models\Form;
use App\Models\Submission;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Notifications\NewFormSubmission;

class FormController extends Controller
{
    public function create()
    {
        return Inertia::render('Forms/Builder');
    }

    /**
     * Create a brand new form (Creator)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'  => 'required|string|max:255',
            'schema' => 'required|array',
        ]);

        $form = Form::create([
            'user_id' => Auth::id(),
            'title'   => $validated['title'],
            'slug'    => Str::slug($validated['title']) . '-' . Str::random(5),
            'schema'  => $validated['schema'],
            'is_active' => true,
        ]);

        return redirect()->back()->with('flash', [
            'message' => 'Form published successfully!',
            'slug'    => $form->slug,
            'id'      => $form->id,
        ]);
    }

    /**
     * Update the current row (Creator)
     */
    public function update(Request $request, Form $form)
    {
        if ($form->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'title'  => 'required|string|max:255',
            'schema' => 'required|array',
        ]);

        $form->update([
            'title'  => $validated['title'],
            'schema' => $validated['schema'],
        ]);

        return redirect()->back()->with('flash', [
            'message' => 'Changes saved successfully!',
            'slug'    => $form->slug,
            'id'      => $form->id,
        ]);
    }

    /**
     * Handle public form submission (Respondent)
     * This fixes the "Call to undefined method" error.
     */
    public function submit(Request $request, $slug)
    {
        // 1. Find the form
        $form = Form::where('slug', $slug)->where('is_active', true)->firstOrFail();

        // 2. Validate the incoming data
        $validated = $request->validate([
            'data' => 'required|array',
        ]);

        // 3. Save the submission
        $submission = $form->submissions()->create([
            'data' => $validated['data'],
        ]);

        // --- STEP 3: TRIGGER NOTIFICATION ---
        // We notify the user who OWNS the form ($form->user)
        $form->user->notify(new NewFormSubmission($form, $submission));
        // -------------------------------------

        return redirect()->back()->with('message', 'Thank you! Your response has been submitted.');
    }

    /**
     * Public view of the form
     */
    public function show($slug)
    {
        $form = Form::where('slug', $slug)->where('is_active', true)->firstOrFail();
        return Inertia::render('Forms/PublicView', ['form' => $form]);
    }

    /**
     * Edit existing form in builder
     */
    public function edit(Form $form)
    {
        if ($form->user_id !== Auth::id()) abort(403);
        return Inertia::render('Forms/Builder', ['form' => $form]);
    }

    /**
     * View responses
     */
    public function submissions(Form $form)
    {
        if ($form->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('Forms/Submissions', [
            'form' => $form,
            'submissions' => $form->submissions()->latest()->paginate(20)
        ]);
    }
    /**
     * Remove the form and its submissions.
     */
    public function destroy(Form $form)
    {
        // Guard against unauthorized deletion
        if ($form->user_id !== Auth::id()) {
            abort(403);
        }

        // Delete the form (associated submissions are deleted automatically if 
        // using cascadeOnDelete, or manually here)
        $form->submissions()->delete();
        $form->delete();

        return redirect()->route('dashboard')->with('message', 'Form deleted successfully.');
    }
}
