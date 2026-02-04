<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AccountStatusUpdated extends Notification
{
    use Queueable;

    protected $status;
    protected $reason; // New protected property

    /**
     * Create a new notification instance.
     * Updated to accept the reason.
     */
    public function __construct($status, $reason = null)
    {
        $this->status = $status;
        $this->reason = $reason;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail($notifiable): MailMessage
    {
        $statusInfo = $this->getStatusData();

        $mail = (new MailMessage)
            ->subject('Account Update: ' . $statusInfo['title'])
            ->greeting('Hello ' . ($notifiable->full_name ?? $notifiable->name) . ',')
            ->line($statusInfo['message']);

        // If rejected and a reason exists, highlight it in the email
        if ($this->status === 'rejected' && $this->reason) {
            $mail->line('**Reason for Rejection:** ' . $this->reason);
        }

        return $mail->action('Log in to Dashboard', url('/dashboard'))
            ->line('If you have any questions, please contact our support team.');
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray($notifiable): array
    {
        return $this->getStatusData();
    }

    /**
     * Helper to centralize titles and messages.
     */
    protected function getStatusData(): array
    {
        return match ($this->status) {
            'approved' => [
                'title' => 'Account Approved! 🎉',
                'message' => 'Your creator account is verified. You can now create forms and manage your content.',
                'type' => 'verification',
                'status' => 'approved',
            ],
            'rejected' => [
                'title' => 'Verification Rejected',
                'message' => 'Your identification could not be verified.',
                'reason' => $this->reason, // Store reason in DB so frontend can show it
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
                'message' => 'Your account status has been updated by the system.',
                'type' => 'system',
                'status' => 'info'
            ],
        };
    }
}