<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create the Super Admin
        User::create([
            'name' => 'System Admin',
            'email' => 'admin@formflow.com',
            'password' => Hash::make('password123'), // Change this!
            'role' => 1, // Super Admin
        ]);

        // Create a test Form Creator
        User::create([
            'name' => 'Jane Creator',
            'email' => 'jane@example.com',
            'password' => Hash::make('password123'),
            'role' => 0, // Form Creator
        ]);
    }
}