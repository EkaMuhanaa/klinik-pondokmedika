<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\Promo;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class CmsFeaturesTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): static
    {
        return $this->actingAs(User::factory()->create(), 'sanctum');
    }

    public function test_site_settings_return_defaults_and_can_be_updated_by_admin(): void
    {
        $this->getJson('/api/site-settings')->assertOk()
            ->assertJsonPath('clinic_name', 'Klinik Pondok Medika')
            ->assertJsonPath('kecamatan', 'Cengkareng');

        $this->putJson('/api/admin/site-settings', ['phone' => '021-123'])->assertUnauthorized();

        $this->admin()->putJson('/api/admin/site-settings', [
            'address_street' => 'Jl. Cendrawasih Raya No. 10',
            'whatsapp' => '6281111111111',
            'unknown_key' => 'diabaikan',
        ])->assertOk()->assertJsonPath('address_street', 'Jl. Cendrawasih Raya No. 10');

        $this->getJson('/api/site-settings')
            ->assertJsonPath('whatsapp', '6281111111111')
            ->assertJsonMissingPath('unknown_key');
    }

    public function test_site_settings_validate_whatsapp_and_urls(): void
    {
        $this->admin()->putJson('/api/admin/site-settings', [
            'whatsapp' => '0812-3456',
            'instagram_url' => 'bukan-url',
        ])->assertUnprocessable()->assertJsonValidationErrors(['whatsapp', 'instagram_url']);
    }

    public function test_active_promo_respects_status_and_schedule(): void
    {
        $this->getJson('/api/promos/active')->assertOk()->assertContent('{}');

        Promo::create(['title' => 'Nonaktif', 'is_active' => false]);
        Promo::create(['title' => 'Belum mulai', 'starts_at' => now()->addDay()]);
        Promo::create(['title' => 'Sudah lewat', 'ends_at' => now()->subDay()]);
        $this->getJson('/api/promos/active')->assertContent('{}');

        Promo::create(['title' => 'Tayang', 'starts_at' => now()->subDay(), 'ends_at' => now()->addDay()]);
        $this->getJson('/api/promos/active')->assertJsonPath('title', 'Tayang');
    }

    public function test_admin_can_manage_promo_with_image(): void
    {
        Storage::fake('public');

        $this->postJson('/api/admin/promos', ['title' => 'x'])->assertUnauthorized();

        $id = $this->admin()->post('/api/admin/promos', [
            'title' => 'Cek Gula Darah Gratis',
            'button_text' => 'Daftar via WhatsApp',
            'button_url' => 'https://wa.me/6281234163128',
            'is_active' => '1',
            'image' => UploadedFile::fake()->image('promo.jpg'),
        ], ['Accept' => 'application/json'])->assertCreated()->json('id');

        $promo = Promo::find($id);
        Storage::disk('public')->assertExists(str_replace('/storage/', '', $promo->image_path));

        $this->post("/api/admin/promos/{$id}", ['is_active' => '0'], ['Accept' => 'application/json'])
            ->assertOk()->assertJsonPath('is_active', false);

        $this->post('/api/admin/promos', ['title' => 'x', 'button_url' => 'javascript:alert(1)'], ['Accept' => 'application/json'])
            ->assertUnprocessable()->assertJsonValidationErrors('button_url');

        $this->deleteJson("/api/admin/promos/{$id}")->assertOk();
        Storage::disk('public')->assertMissing(str_replace('/storage/', '', $promo->image_path));
    }

    public function test_sitemap_lists_static_pages_and_published_articles_only(): void
    {
        Article::forceCreate(['title' => 'A', 'slug' => 'artikel-terbit', 'content' => 'x', 'category' => 'c', 'is_published' => true]);
        Article::forceCreate(['title' => 'B', 'slug' => 'artikel-draft', 'content' => 'x', 'category' => 'c', 'is_published' => false]);

        config(['clinic.frontend_url' => 'https://klinikpondokmedika.id']);

        $res = $this->get('/sitemap.xml')->assertOk()->assertHeader('Content-Type', 'application/xml; charset=UTF-8');
        $xml = $res->getContent();

        $this->assertStringContainsString('<loc>https://klinikpondokmedika.id/</loc>', $xml);
        $this->assertStringContainsString('/layanan/poli-gigi-mulut</loc>', $xml);
        $this->assertStringContainsString('/artikel/artikel-terbit</loc>', $xml);
        $this->assertStringNotContainsString('artikel-draft', $xml);
    }
}
