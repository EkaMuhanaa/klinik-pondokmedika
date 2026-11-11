<?php

namespace Tests\Feature;

use App\Models\Doctor;
use App\Models\Service;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ServicesDoctorsTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): static
    {
        return $this->actingAs(User::factory()->create(), 'sanctum');
    }

    public function test_migration_moves_existing_content_into_database(): void
    {
        $this->assertSame(9, Service::count());
        $this->assertTrue(Service::where('slug', 'poli-umum')->value('is_featured'));
        $this->assertFalse(Service::where('slug', 'nebulizer')->value('is_active'));
        $this->assertSame(2, Doctor::count());
        $this->assertSame('/images/dr-arya.jpg', Doctor::where('name', 'like', '%ARYA%')->value('photo_path'));
    }

    public function test_public_services_include_home_only_items_and_hide_disabled_ones(): void
    {
        Service::create(['slug' => 'tersembunyi', 'title' => 'Tersembunyi', 'is_active' => false, 'show_on_home' => false]);

        $slugs = collect($this->getJson('/api/services')->assertOk()->json())->pluck('slug');
        $this->assertContains('poli-gigi-mulut', $slugs);
        $this->assertContains('nebulizer', $slugs);
        $this->assertNotContains('tersembunyi', $slugs);
    }

    public function test_admin_can_manage_services_and_only_one_is_featured(): void
    {
        $this->postJson('/api/admin/services', ['title' => 'x', 'icon' => 'umum'])->assertUnauthorized();

        $id = $this->admin()->postJson('/api/admin/services', [
            'title' => 'Vaksinasi Dewasa',
            'icon' => 'vaksin',
            'summary' => 'Vaksin influenza dan hepatitis B.',
            'is_active' => true,
            'is_featured' => true,
        ])->assertCreated()->assertJsonPath('slug', 'vaksinasi-dewasa')->json('id');

        $this->assertSame(1, Service::where('is_featured', true)->count());
        $this->assertTrue(Service::find($id)->is_featured);

        $this->postJson('/api/admin/services', ['title' => 'Lain', 'slug' => 'vaksinasi-dewasa', 'icon' => 'umum'])
            ->assertUnprocessable()->assertJsonValidationErrors('slug');

        $this->putJson("/api/admin/services/{$id}", ['title' => 'Vaksinasi Dewasa', 'slug' => 'vaksinasi-dewasa', 'icon' => 'vaksin', 'is_active' => false])
            ->assertOk()->assertJsonPath('is_active', false);

        $this->get('/sitemap.xml')->assertDontSee('vaksinasi-dewasa');
        $this->deleteJson("/api/admin/services/{$id}")->assertOk();
    }

    public function test_admin_can_manage_doctors_with_photo_and_schedule(): void
    {
        Storage::fake('public');

        $id = $this->admin()->post('/api/admin/doctors', [
            'name' => 'drg. Contoh',
            'specialty' => 'Dokter Gigi',
            'schedule' => json_encode([['day' => 'Rabu', 'time' => '16.00 - 20.00']]),
            'is_active' => '1',
            'photo' => UploadedFile::fake()->image('dokter.jpg'),
        ], ['Accept' => 'application/json'])->assertCreated()->json('id');

        $doctor = Doctor::find($id);
        $this->assertSame([['day' => 'Rabu', 'time' => '16.00 - 20.00']], $doctor->schedule);
        Storage::disk('public')->assertExists(str_replace('/storage/', '', $doctor->photo_path));

        $this->post("/api/admin/doctors/{$id}", [
            'name' => 'drg. Contoh',
            'schedule' => json_encode([['day' => 'Rabu', 'time' => 'sore']]),
        ], ['Accept' => 'application/json'])->assertUnprocessable()->assertJsonValidationErrors('schedule.0.time');

        $this->post("/api/admin/doctors/{$id}", ['name' => 'drg. Contoh', 'is_active' => '0'], ['Accept' => 'application/json'])->assertOk();
        $this->assertNotContains($id, collect($this->getJson('/api/doctors')->json())->pluck('id'));

        $this->deleteJson("/api/admin/doctors/{$id}")->assertOk();
        Storage::disk('public')->assertMissing(str_replace('/storage/', '', $doctor->photo_path));
    }

    public function test_sitemap_lists_active_services_from_database(): void
    {
        $xml = $this->get('/sitemap.xml')->assertOk()->getContent();
        $this->assertStringContainsString('/layanan/poli-kia</loc>', $xml);
        $this->assertStringNotContainsString('/layanan/nebulizer', $xml);
    }

    public function test_new_content_settings_have_defaults(): void
    {
        $this->getJson('/api/site-settings')
            ->assertJsonPath('doctors_heading', 'Bertemu dengan Dokter Spesialis Kami')
            ->assertJsonPath('about_highlights', "Terakreditasi | Standar Pelayanan Nasional\nTim Ahli | Dokter Berpengalaman");
    }

    public function test_new_items_without_order_go_last(): void
    {
        $max = Service::max('sort_order');
        $this->admin()->postJson('/api/admin/services', ['title' => 'Paling Akhir', 'icon' => 'umum'])
            ->assertCreated()->assertJsonPath('sort_order', $max + 10);

        $maxDoc = Doctor::max('sort_order');
        $this->post('/api/admin/doctors', ['name' => 'dr. Baru'], ['Accept' => 'application/json'])
            ->assertCreated()->assertJsonPath('sort_order', $maxDoc + 10);
    }
}
