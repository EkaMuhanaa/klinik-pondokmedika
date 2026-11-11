<?php

use App\Models\Setting;
use Illuminate\Database\Migrations\Migration;

/**
 * Data kontak resmi klinik (alamat sesuai Google Maps, email, media sosial).
 * Hanya mengganti nilai yang masih kosong atau masih nilai bawaan lama,
 * sehingga isian yang sudah diubah admin di CMS tidak tertimpa.
 */
return new class extends Migration
{
    private array $values = [
        'address_street' => ['Jl. Cendrawasih Raya No.87 RT.007/RW.006, Komplek Perumahan Imigrasi', ['Jl. Cendrawasih Raya']],
        'email' => ['info@klinikpondokmedika.id', ['info@pondokmedika.com']],
        'instagram_url' => ['https://www.instagram.com/pondokmedika/', []],
        'facebook_url' => ['https://www.facebook.com/p/Klinik-Pondok-Medika-100084835231382/', []],
    ];

    public function up(): void
    {
        foreach ($this->values as $key => [$value, $oldDefaults]) {
            $current = Setting::where('key', $key)->value('value');
            if ($current === null || $current === '' || in_array($current, $oldDefaults, true)) {
                Setting::updateOrCreate(['key' => $key], ['value' => $value, 'type' => 'string']);
            }
        }
    }

    public function down(): void
    {
        // Data kontak tidak dikembalikan otomatis.
    }
};
