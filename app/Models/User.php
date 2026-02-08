<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Casts\Attribute;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'avatar', // Added for Google/DiceBear photos
        'password',
        'google_id',
        'has_password',
        'role',
        'status',
        'is_admin',
        'verification_status', // 'pending', 'approved', 'rejected'
        'rejection_reason',
        'full_name',
        'organization',
        'id_number',
        'id_photo_path',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'has_password' => 'boolean',
        ];
    }

    /**
     * Accessor for the user's avatar.
     * If the 'avatar' column is empty, it generates a random animated 
     * character using DiceBear based on the user's name.
     */
    protected function avatar(): Attribute
    {
        return Attribute::make(
            get: function ($value) {
                // Return Google photo if it exists in the database
                if ($value) return $value;

                // Return animated avatar as fallback
                return "https://api.dicebear.com/7.x/adventurer/svg?seed=" . urlencode($this->name);
            },
        );
    }

    // --- Roles ---

    public function isSuperAdmin(): bool
    {
        return (int) $this->role === 1;
    }

    public function isCreator(): bool
    {
        return (int) $this->role === 0;
    }

    // --- Verification Helpers ---

    /**
     * Determine if the creator is fully approved.
     */
    public function isVerifiedCreator(): bool
    {
        return $this->verification_status === 'approved';
    }

    /**
     * Determine if the creator has a submission waiting for review.
     */
    public function isVerificationUnderReview(): bool
    {
        return $this->verification_status === 'pending' && !empty($this->id_photo_path);
    }

    /**
     * Determine if the creator needs to see the verification modal.
     */
    public function needsVerification(): bool
    {
        // Admins don't need verification
        if ($this->isSuperAdmin()) {
            return false;
        }

        return $this->verification_status === 'rejected' || 
               ($this->verification_status === 'pending' && empty($this->id_photo_path));
    }

    // --- Relationships ---

    /**
     * A user (creator) can have many forms.
     */
    public function forms(): HasMany
    {
        return $this->hasMany(Form::class);
    }
}