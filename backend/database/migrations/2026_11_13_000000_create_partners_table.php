<?php

use App\Models\Partner;
use App\Models\Setting;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('partners', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('logo_path')->nullable();
            $table->string('url')->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        // Pindahkan daftar mitra lama (teks di Pengaturan Klinik, satu nama per baris) ke tabel
        $text = Setting::where('key', 'partners')->value('value') ?? config('clinic.legacy_partners', '');
        $names = array_values(array_filter(array_map('trim', explode("\n", (string) $text))));
        foreach ($names as $i => $name) {
            Partner::create(['name' => $name, 'sort_order' => ($i + 1) * 10]);
        }
        Setting::where('key', 'partners')->delete();
    }

    public function down(): void
    {
        Schema::dropIfExists('partners');
    }
};
