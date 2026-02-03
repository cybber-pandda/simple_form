<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;

class AccountStatusUpdated extends Notification
{
    protected $status;

    public function __construct($status)
    {
        $this->status = $status;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toArray($notifiable)
    {
        return match ($this->status) {
            'approved' => [
                'title' => 'Account Approved! 🎉',
                'message' => 'Your creator account is verified. You can now create forms.',
                'type' => 'verification',
                'status' => 'approved'
            ],
            'rejected' => [
                'title' => 'Verification Rejected',
                'message' => 'Your identification could not be verified. Please contact support.',
                'type' => 'verification',
                'status' => 'rejected'
            ],
            'deactivated' => [
                'title' => 'Account Deactivated',
                'message' => 'Your account access has been suspended by an administrator.',
                'type' => 'security',
                'status' => 'deactivated'
            ],
            'activated' => [
                'title' => 'Account Reactivated',
                'message' => 'Welcome back! Your account access has been fully restored.',
                'type' => 'security',
                'status' => 'activated'
            ],
            default => [
                'title' => 'System Update',
                'message' => 'Your account status has been updated.',
                'type' => 'system',
                'status' => 'info'
            ],
        };
    }
}
