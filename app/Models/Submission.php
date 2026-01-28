<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Submission extends Model
{
    // Allow saving data into these columns
    protected $fillable = ['form_id', 'data', 'ip_address'];

    // This ensures the JSON "data" column is handled as an array in PHP
    protected $casts = [
        'data' => 'array',
    ];

    public function form()
    {
        return $this->belongsTo(Form::class);
    }
}
