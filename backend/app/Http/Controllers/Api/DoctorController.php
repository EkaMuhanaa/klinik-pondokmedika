<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class DoctorController extends Controller
{
    /** Publik: dokter aktif. */
    public function index()
    {
        return response()->json(Doctor::where('is_active', true)->orderBy('sort_order')->orderBy('id')->get());
    }

    public function adminIndex()
    {
        return response()->json(Doctor::orderBy('sort_order')->orderBy('id')->get());
    }

    public function show($id)
    {
        return response()->json(Doctor::findOrFail($id));
    }

    public function store(Request $request)
    {
        $doctor = new Doctor($this->validated($request));
        $this->handlePhoto($request, $doctor);
        $doctor->save();

        return response()->json($doctor, 201);
    }

    public function update(Request $request, $id)
    {
        $doctor = Doctor::findOrFail($id);
        $doctor->fill($this->validated($request));
        $this->handlePhoto($request, $doctor);
        $doctor->save();

        return response()->json($doctor);
    }

    public function destroy($id)
    {
        $doctor = Doctor::findOrFail($id);
        $this->deletePhoto($doctor->photo_path);
        $doctor->delete();

        return response()->json(['message' => 'Dokter dihapus']);
    }

    private function validated(Request $request): array
    {
        // Jadwal dikirim sebagai JSON string dari form multipart
        if (is_string($request->input('schedule'))) {
            $request->merge(['schedule' => json_decode($request->input('schedule'), true) ?? []]);
        }

        $data = $request->validate([
            'name' => 'required|string|max:120',
            'specialty' => 'nullable|string|max:120',
            'description' => 'nullable|string|max:1000',
            'schedule' => 'nullable|array|max:7',
            'schedule.*.day' => ['required', Rule::in(Doctor::DAYS)],
            'schedule.*.time' => ['required', 'regex:/^\d{2}\.\d{2} - \d{2}\.\d{2}$/'],
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer|min:0|max:100000',
            'photo' => 'nullable|image|max:2048',
            'remove_photo' => 'sometimes|boolean',
        ], [
            'schedule.*.time.regex' => 'Format jam praktik harus seperti 13.00 - 21.00.',
        ]);

        if ($request->has('is_active')) {
            $data['is_active'] = $request->boolean('is_active');
        }
        $data['schedule'] = array_values($data['schedule'] ?? []);
        // Tanpa urutan: taruh di paling akhir
        $data['sort_order'] = $data['sort_order'] ?? ((Doctor::max('sort_order') ?? 0) + 10);
        unset($data['photo'], $data['remove_photo']);

        return $data;
    }

    private function handlePhoto(Request $request, Doctor $doctor): void
    {
        if ($request->hasFile('photo')) {
            $this->deletePhoto($doctor->photo_path);
            $doctor->photo_path = '/storage/'.$request->file('photo')->store('doctors', 'public');
        } elseif ($request->boolean('remove_photo')) {
            $this->deletePhoto($doctor->photo_path);
            $doctor->photo_path = null;
        }
    }

    private function deletePhoto(?string $path): void
    {
        // Foto bawaan frontend (/images/...) tidak ada di storage, jangan dihapus
        if ($path && str_starts_with($path, '/storage/')) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $path));
        }
    }
}
