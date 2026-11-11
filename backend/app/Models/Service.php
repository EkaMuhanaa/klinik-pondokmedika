<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    public const ICONS = ['umum', 'gigi', 'ibu-anak', 'lab', 'apotek', 'darurat', 'bedah', 'nebulizer', 'home-visit', 'vaksin', 'jantung', 'mata'];

    protected $fillable = [
        'slug', 'title', 'summary', 'background', 'explanation', 'conditions', 'stages', 'location_note',
        'icon', 'is_active', 'show_on_home', 'is_featured', 'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'show_on_home' => 'boolean',
            'is_featured' => 'boolean',
            'sort_order' => 'integer',
        ];
    }
}
