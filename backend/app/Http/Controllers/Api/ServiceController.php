<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ServiceController extends Controller
{
    /** Publik: layanan yang punya halaman atau tampil di Beranda, urut sesuai sort_order. */
    public function index()
    {
        return response()->json(
            Service::where(fn ($q) => $q->where('is_active', true)->orWhere('show_on_home', true))
                ->orderBy('sort_order')->orderBy('id')->get()
        );
    }

    /** Admin: semua layanan. */
    public function adminIndex()
    {
        return response()->json(Service::orderBy('sort_order')->orderBy('id')->get());
    }

    public function show($id)
    {
        return response()->json(Service::findOrFail($id));
    }

    public function store(Request $request)
    {
        $service = DB::transaction(function () use ($request) {
            $service = Service::create($this->validated($request));
            $this->keepSingleFeatured($service);

            return $service;
        });

        return response()->json($service, 201);
    }

    public function update(Request $request, $id)
    {
        $service = Service::findOrFail($id);
        DB::transaction(function () use ($request, $service) {
            $service->update($this->validated($request, $service));
            $this->keepSingleFeatured($service);
        });

        return response()->json($service->fresh());
    }

    public function destroy($id)
    {
        Service::findOrFail($id)->delete();

        return response()->json(['message' => 'Layanan dihapus']);
    }

    private function validated(Request $request, ?Service $service = null): array
    {
        $request->merge(['slug' => Str::slug($request->input('slug') ?: $request->input('title', ''))]);

        $data = $request->validate([
            'title' => 'required|string|max:120',
            'slug' => ['required', 'string', 'max:120', Rule::unique('services', 'slug')->ignore($service?->id)],
            'summary' => 'nullable|string|max:500',
            'background' => 'nullable|string|max:5000',
            'explanation' => 'nullable|string|max:5000',
            'conditions' => 'nullable|string|max:5000',
            'stages' => 'nullable|string|max:5000',
            'location_note' => 'nullable|string|max:500',
            'icon' => ['required', Rule::in(Service::ICONS)],
            'is_active' => 'boolean',
            'show_on_home' => 'boolean',
            'is_featured' => 'boolean',
            'sort_order' => 'nullable|integer|min:0|max:100000',
        ], [
            'slug.unique' => 'Alamat halaman (slug) ini sudah dipakai layanan lain.',
        ]);
        // Tanpa urutan: taruh di paling akhir
        $data['sort_order'] = $data['sort_order'] ?? ((Service::max('sort_order') ?? 0) + 10);

        return $data;
    }

    /** Hanya satu layanan yang boleh ditonjolkan. */
    private function keepSingleFeatured(Service $service): void
    {
        if ($service->is_featured) {
            Service::where('id', '!=', $service->id)->update(['is_featured' => false]);
        }
    }
}
