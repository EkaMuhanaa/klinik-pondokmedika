<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('admin:create {email} {--name=Admin}', function (string $email) {
    if (\App\Models\User::where('email', $email)->exists()) {
        $this->info("Admin {$email} sudah ada, tidak diubah.");
        return 0;
    }

    // Password dari env ADMIN_PASSWORD (untuk script), atau ditanyakan secara tersembunyi.
    $password = getenv('ADMIN_PASSWORD') ?: $this->secret('Password admin (min. 8 karakter)');
    if (strlen((string) $password) < 8) {
        $this->error('Password minimal 8 karakter.');
        return 1;
    }

    \App\Models\User::create([
        'name' => $this->option('name'),
        'email' => $email,
        'password' => $password,
    ]);
    $this->info("Admin {$email} dibuat.");
    return 0;
})->purpose('Membuat akun admin panel');
