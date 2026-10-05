<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Setting;
use Illuminate\Support\Facades\Storage;

class SettingController extends Controller
{
    public function show($key)
    {
        $setting = Setting::where("key", $key)->first();
        if (!$setting) {
            return response()->json(["message" => "Setting not found"], 404);
        }
        return response()->json($setting);
    }

    public function uploadBackground(Request $request)
    {
        $request->validate([
            "key" => "required|string",
            "image" => "required|image|max:5120" // Max 5MB
        ]);

        $setting = Setting::firstOrNew(["key" => $request->key]);

        if ($setting->exists && $setting->value && $setting->type === "image") {
            // Delete old image
            $oldPath = str_replace("/storage/", "", $setting->value);
            Storage::disk("public")->delete($oldPath);
        }

        $path = $request->file("image")->store("settings", "public");
        
        $setting->value = "/storage/" . $path;
        $setting->type = "image";
        $setting->save();

        return response()->json($setting);
    }
}

