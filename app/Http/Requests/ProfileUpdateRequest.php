<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $user = $this->user();

        return [
            'name' => ['required', 'string', 'max:255'],
            
            'email' => [
                // If the user has a google_id, email is optional/nullable 
                // because the input is disabled and not sent by the frontend.
                $user->google_id ? 'nullable' : 'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($user->id),
            ],

            /**
             * The avatar field stores the URL (Google or DiceBear).
             * We set it to nullable and string with a high character limit 
             * to accommodate long CDN or OAuth image URLs.
             */
            'avatar' => ['nullable', 'string', 'max:1000'], 
        ];
    }
}