<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SliderImage;
use Illuminate\Support\Facades\Storage;

class SliderImageController extends Controller
{
    // Public endpoint to get slider images for a specific page
    public function index($page)
    {
        $sliders = SliderImage::where('page', $page)->orderBy('order', 'asc')->orderBy('id', 'desc')->get();
        return response()->json($sliders);
    }

    // Admin endpoint to upload new slider image
    public function store(Request $request)
    {
        $request->validate([
            'page' => 'required|string',
            'image' => 'required|image|max:5120' // 5MB max
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('sliders', 'public');
            
            $slider = SliderImage::create([
                'page' => $request->page,
                'image_path' => '/storage/' . $path,
                'order' => SliderImage::where('page', $request->page)->max('order') + 1
            ]);

            return response()->json($slider, 201);
        }

        return response()->json(['message' => 'No image uploaded'], 400);
    }

    // Admin endpoint to delete a slider image
    public function destroy($id)
    {
        $slider = SliderImage::findOrFail($id);
        
        if ($slider->image_path) {
            $oldPath = str_replace("/storage/", "", $slider->image_path);
            Storage::disk("public")->delete($oldPath);
        }
        
        $slider->delete();
        
        return response()->json(['message' => 'Deleted successfully']);
    }
}
