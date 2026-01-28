<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Submission;

class Form extends Model
{
    protected $fillable = ['user_id', 'title', 'slug', 'schema', 'is_active'];

    // This automatically converts the JSON string to an array when you use it in React
    protected $casts = [
        'schema' => 'array',
        'is_active' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    
    public function submissions()
    {
        return $this->hasMany(Submission::class);
    }
}