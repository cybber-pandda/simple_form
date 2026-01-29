<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('verification_status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->string('full_name')->nullable();
            $table->string('organization')->nullable();
            $table->string('id_number')->nullable();
            $table->string('id_photo_path')->nullable();
            $table->boolean('is_admin')->default(false); // To distinguish Super Admin
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['verification_status', 'full_name', 'organization', 'id_number', 'id_photo_path', 'is_admin']);
        });
    }
};