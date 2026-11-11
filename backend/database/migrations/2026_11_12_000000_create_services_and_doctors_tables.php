<?php

use Database\Seeders\ClinicContentSeeder;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->text('summary')->nullable();
            $table->text('background')->nullable();
            $table->text('explanation')->nullable();
            $table->text('conditions')->nullable();
            $table->text('stages')->nullable();
            $table->text('location_note')->nullable();
            $table->string('icon')->default('umum');
            $table->boolean('is_active')->default(true);      // punya halaman & tampil di menu Layanan
            $table->boolean('show_on_home')->default(false);  // tampil di Beranda
            $table->boolean('is_featured')->default(false);   // ditonjolkan (satu saja)
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('doctors', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('specialty')->nullable();
            $table->text('description')->nullable();
            $table->string('photo_path')->nullable();
            $table->json('schedule')->nullable(); // [{"day":"Senin","time":"13.00 - 21.00"}]
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        // Pindahkan konten yang sebelumnya tertulis di kode frontend ke database
        (new ClinicContentSeeder)->run();
    }

    public function down(): void
    {
        Schema::dropIfExists('doctors');
        Schema::dropIfExists('services');
    }
};
