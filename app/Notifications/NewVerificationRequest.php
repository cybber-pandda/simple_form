<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use App\Models\User;

class NewVerificationRequest extends Notification
{
    use Queueable;

    protected $user;

    public function __construct(User $user)
    {
        $this->user = $user;
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Updated to support Ziggy route names
     */
    public function toDatabase(object $notifiable): array
    {
        return [
            'title' => 'New Verification Request',
            'message' => "{$this->user->name} has submitted an account verification request.",
            // This MUST match the name in your routes/web.php
            'route_name' => 'admin.verifications.index', 
            // If your route needs an ID (e.g., admin.verifications.show), add it here:
            'params' => [
                'id' => $this->user->id 
            ],
            'type' => 'verification_pending',
        ];
    }
}