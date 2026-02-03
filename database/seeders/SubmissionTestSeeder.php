<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Submission;
use Carbon\Carbon;

class SubmissionTestSeeder extends Seeder
{
    public function run(): void
    {
        $targetFormId = 51;

        // Data payload to match your array cast
        $dummyData = [
            'status' => 'Testing Analytics',
            'browser' => 'Chrome',
            'location' => 'Internal Test'
        ];

        $this->command->info("Injecting test submissions for Form ID: {$targetFormId}");

        // 1. TODAY (For the 'Day' Filter)
        // Creating 8 entries for today at different hours
        for ($i = 0; $i < 8; $i++) {
            Submission::create([
                'form_id'    => $targetFormId,
                'data'       => $dummyData,
                'ip_address' => '127.0.0.1',
                'created_at' => Carbon::now()->subHours($i),
            ]);
        }

        // 2. LAST 7 DAYS (For the 'Week' Filter)
        // 3 submissions for each of the last 7 days
        for ($day = 1; $day <= 7; $day++) {
            for ($entry = 0; $entry < 3; $entry++) {
                Submission::create([
                    'form_id'    => $targetFormId,
                    'data'       => $dummyData,
                    'ip_address' => '127.0.0.1',
                    'created_at' => Carbon::now()->subDays($day)->setHour(rand(9, 17)),
                ]);
            }
        }

        // 3. LAST 30 DAYS (For the 'Month' Filter)
        // Scattered entries across the last 4 weeks
        for ($week = 1; $week <= 4; $week++) {
            Submission::create([
                'form_id'    => $targetFormId,
                'data'       => $dummyData,
                'ip_address' => '192.168.1.1',
                'created_at' => Carbon::now()->subWeeks($week),
            ]);
        }

        // 4. THIS YEAR (For the 'Year' Filter)
        // One entry for each of the past 6 months
        for ($month = 1; $month <= 6; $month++) {
            Submission::create([
                'form_id'    => $targetFormId,
                'data'       => $dummyData,
                'ip_address' => '8.8.8.8',
                'created_at' => Carbon::now()->subMonths($month),
            ]);
        }

        $this->command->info("Success: Form 51 now has a rich timeline for testing!");
    }
}