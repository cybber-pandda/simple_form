<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
// Import your models if they exist
use App\Models\Form; 
use App\Models\Submission;

class NewFormSubmission extends Notification
{
    use Queueable;

    protected $form;
    protected $submission;

    // Type hinting ensures you don't pass the wrong data by mistake
    public function __construct(Form $form, Submission $submission)
    {
        $this->form = $form;
        $this->submission = $submission;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'title' => 'New Form Submission',
            'message' => 'Someone messaged you from the form "' . $this->form->title . '"',
            'form_id' => $this->form->id,
            'submission_id' => $this->submission->id,
            'type' => 'submission'
        ];
    }
}