<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewFormSubmission extends Notification
{
    use Queueable;

    protected $form;
    protected $submission;

    public function __construct($form, $submission)
    {
        $this->form = $form;
        $this->submission = $submission;
    }

    public function via($notifiable)
    {
        // 'database' saves it to the notifications table we just created
        return ['database'];
    }

    public function toArray($notifiable)
    {
        return [
            'title' => 'New Form Submission',
            'message' => 'Someone submitted your form: "' . $this->form->title . '"',
            'form_id' => $this->form->id,
            'submission_id' => $this->submission->id,
            'type' => 'submission'
        ];
    }
}