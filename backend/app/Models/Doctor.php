<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Doctor extends Model
{
    public const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

    protected $fillable = ['name', 'specialty', 'description', 'photo_path', 'schedule', 'is_active', 'sort_order'];

    protected function casts(): array
    {
        return [
            'schedule' => 'array',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }
}
