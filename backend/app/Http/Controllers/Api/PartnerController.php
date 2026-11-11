<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Partner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PartnerController extends Controller
{
    /** Publik: mitra aktif. */
    public function index()
    {
        return response()->json(Partner::where('is_active', true)->orderBy('sort_order')->orderBy('id')->get());
    }

    public function adminIndex()
    {
        return response()->json(Partner::orderBy('sort_order')->orderBy('id')->get());
    }

    public function show($id)
    {
        return response()->json(Partner::findOrFail($id));
    }

    public function store(Request $request)
    {
        $partner = new Partner($this->validated($request));
        $this->handleLogo($request, $partner);
        $partner->save();

        return response()->json($partner, 201);
    }

    public function update(Request $request, $id)
    {
        $partner = Partner::findOrFail($id);
        $partner->fill($this->validated($request));
        $this->handleLogo($request, $partner);
        $partner->save();

        return response()->json($partner);
    }

    public function destroy($id)
    {
        $partner = Partner::findOrFail($id);
        $this->deleteLogo($partner->logo_path);
        $partner->delete();

        return response()->json(['message' => 'Mitra dihapus']);
    }

    private function validated(Request $request): array
    {
        $data = $request->validate([
            'name' => 'required|string|max:150',
            'url' => 'nullable|url|max:500',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer|min:0|max:100000',
            // SVG tidak diizinkan (bisa berisi script); PNG transparan disarankan
            'logo' => 'nullable|image|mimes:png,jpg,jpeg,webp|max:1024',
            'remove_logo' => 'sometimes|boolean',
        ]);

        if ($request->has('is_active')) {
            $data['is_active'] = $request->boolean('is_active');
        }
        // Tanpa urutan: taruh di paling akhir
        $data['sort_order'] = $data['sort_order'] ?? ((Partner::max('sort_order') ?? 0) + 10);
        unset($data['logo'], $data['remove_logo']);

        return $data;
    }

    private function handleLogo(Request $request, Partner $partner): void
    {
        if ($request->hasFile('logo')) {
            $this->deleteLogo($partner->logo_path);
            $partner->logo_path = '/storage/'.$request->file('logo')->store('partners', 'public');
        } elseif ($request->boolean('remove_logo')) {
            $this->deleteLogo($partner->logo_path);
            $partner->logo_path = null;
        }
    }

    private function deleteLogo(?string $path): void
    {
        if ($path && str_starts_with($path, '/storage/')) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $path));
        }
    }
}
