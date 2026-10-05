<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

use App\Models\Facility;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FacilityController extends Controller
{
    public function index()
    {
        $facilities = Facility::latest()->get();
        return response()->json($facilities);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048'
        ]);

        $facility = new Facility();
        $facility->title = $request->title;
        $facility->description = $request->description;

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('facilities', 'public');
            $facility->image_path = '/storage/' . $path;
        }

        $facility->save();

        return response()->json($facility, 201);
    }

    public function show($id)
    {
        $facility = Facility::findOrFail($id);
        return response()->json($facility);
    }

    public function update(Request $request, $id)
    {
        $facility = Facility::findOrFail($id);

        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048'
        ]);

        if ($request->has('title')) {
            $facility->title = $request->title;
        }
        if ($request->has('description')) {
            $facility->description = $request->description;
        }

        if ($request->hasFile('image')) {
            if ($facility->image_path) {
                $oldPath = str_replace('/storage/', '', $facility->image_path);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('image')->store('facilities', 'public');
            $facility->image_path = '/storage/' . $path;
        }

        $facility->save();

        return response()->json($facility);
    }

    public function destroy($id)
    {
        $facility = Facility::findOrFail($id);
        
        if ($facility->image_path) {
            $oldPath = str_replace('/storage/', '', $facility->image_path);
            Storage::disk('public')->delete($oldPath);
        }
        
        $facility->delete();

        return response()->json(['message' => 'Fasilitas berhasil dihapus']);
    }
}
