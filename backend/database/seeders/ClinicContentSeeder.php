<?php

namespace Database\Seeders;

use App\Models\Doctor;
use App\Models\Service;
use Illuminate\Database\Seeder;

/** Isi awal layanan & dokter (diambil dari konten lama di kode frontend). Hanya mengisi tabel yang masih kosong. */
class ClinicContentSeeder extends Seeder
{
    public function run(): void
    {
        if (Service::count() === 0) {
            foreach (json_decode(file_get_contents(__DIR__.'/data/services.json'), true) as $row) {
                Service::create($row);
            }
        }

        if (Doctor::count() === 0) {
            foreach (json_decode(file_get_contents(__DIR__.'/data/doctors.json'), true) as $row) {
                Doctor::create($row);
            }
        }
    }
}
