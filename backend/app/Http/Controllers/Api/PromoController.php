<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Promo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PromoController extends Controller
{
    /** Publik: satu promo yang sedang tayang (terbaru), atau null. */
    public function active()
    {
        return response()->json(Promo::live()->latest('updated_at')->first());
    }

    /** Admin: semua promo. */
    public function index()
    {
        return response()->json(Promo::latest()->get());
    }

    public function show($id)
    {
        return response()->json(Promo::findOrFail($id));
    }

    public function store(Request $request)
    {
        $promo = new Promo($this->validated($request, true));
        $this->handleImage($request, $promo);
        $promo->save();

        return response()->json($promo, 201);
    }

    public function update(Request $request, $id)
    {
        $promo = Promo::findOrFail($id);
        $promo->fill($this->validated($request, false));
        $this->handleImage($request, $promo);
        $promo->save();

        return response()->json($promo);
    }

    public function destroy($id)
    {
        $promo = Promo::findOrFail($id);
        $this->deleteImage($promo->image_path);
        $promo->delete();

        return response()->json(['message' => 'Promo berhasil dihapus']);
    }

    private function validated(Request $request, bool $creating): array
    {
        $data = $request->validate([
            'title' => ($creating ? 'required' : 'sometimes|required').'|string|max:255',
            'description' => 'nullable|string|max:1000',
            'button_text' => 'nullable|string|max:60',
            'button_url' => ['nullable', 'string', 'max:500', 'regex:#^(https?://|/|tel:|mailto:)#i'],
            'is_active' => 'sometimes|boolean',
            'starts_at' => 'nullable|date',
            'ends_at' => 'nullable|date|after_or_equal:starts_at',
            'image' => 'nullable|image|max:2048',
            'remove_image' => 'sometimes|boolean',
        ], [
            'button_url.regex' => 'Link tombol harus diawali https://, http://, / (halaman website), tel: atau mailto:.',
            'ends_at.after_or_equal' => 'Tanggal selesai harus setelah tanggal mulai.',
        ]);

        if ($request->has('is_active')) {
            $data['is_active'] = $request->boolean('is_active');
        }

        unset($data['image'], $data['remove_image']);

        return $data;
    }

    private function handleImage(Request $request, Promo $promo): void
    {
        if ($request->hasFile('image')) {
            $this->deleteImage($promo->image_path);
            $promo->image_path = '/storage/'.$request->file('image')->store('promos', 'public');
        } elseif ($request->boolean('remove_image')) {
            $this->deleteImage($promo->image_path);
            $promo->image_path = null;
        }
    }

    private function deleteImage(?string $path): void
    {
        if ($path) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $path));
        }
    }
}
