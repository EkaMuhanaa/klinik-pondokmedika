<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SiteSettingController extends Controller
{
    /** Gabungan nilai default (config/clinic.php) dengan nilai yang disimpan admin. */
    public static function current(): array
    {
        $defaults = config('clinic.settings');
        $saved = Setting::whereIn('key', array_keys($defaults))->pluck('value', 'key')->all();

        return array_merge($defaults, array_map(fn ($v) => $v ?? '', $saved));
    }

    public function index()
    {
        return response()->json(self::current());
    }

    public function update(Request $request)
    {
        $keys = array_keys(config('clinic.settings'));

        $rules = array_fill_keys($keys, 'sometimes|nullable|string|max:1000');
        $rules['email'] = 'sometimes|nullable|email|max:255';
        $rules['whatsapp'] = ['sometimes', 'nullable', 'regex:/^62\d{8,13}$/'];
        $rules['latitude'] = 'sometimes|nullable|numeric|between:-90,90';
        $rules['longitude'] = 'sometimes|nullable|numeric|between:-180,180';
        $rules['opening_time'] = ['sometimes', 'nullable', 'regex:/^\d{2}:\d{2}$/'];
        $rules['closing_time'] = ['sometimes', 'nullable', 'regex:/^\d{2}:\d{2}$/'];
        foreach (['maps_url', 'instagram_url', 'facebook_url', 'tiktok_url', 'youtube_url'] as $k) {
            $rules[$k] = 'sometimes|nullable|url|max:500';
        }

        $data = $request->validate($rules, [
            'whatsapp.regex' => 'Nomor WhatsApp harus format internasional diawali 62, contoh 6281234567890.',
        ]);

        foreach ($data as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value ?? '', 'type' => 'string']);
        }

        return response()->json(self::current());
    }
}
