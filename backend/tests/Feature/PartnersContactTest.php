<?php

namespace Tests\Feature;

use App\Models\Partner;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PartnersContactTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): static
    {
        return $this->actingAs(User::factory()->create(), 'sanctum');
    }

    public function test_legacy_partner_list_is_migrated_into_table(): void
    {
        $this->assertSame(9, Partner::count());
        $this->assertSame('Puskesmas Cengkareng', Partner::orderBy('sort_order')->value('name'));
        $this->assertFalse(Setting::where('key', 'partners')->exists());
    }

    public function test_admin_can_manage_partner_logo_and_public_list_hides_inactive(): void
    {
        Storage::fake('public');

        $id = $this->admin()->post('/api/admin/partners', [
            'name' => 'RS Contoh',
            'url' => 'https://contoh.example',
            'logo' => UploadedFile::fake()->image('logo.png', 300, 100),
        ], ['Accept' => 'application/json'])->assertCreated()->json('id');

        $partner = Partner::find($id);
        Storage::disk('public')->assertExists(str_replace('/storage/', '', $partner->logo_path));
        $this->assertSame(Partner::max('sort_order'), $partner->sort_order);

        $this->post('/api/admin/partners', ['name' => 'X', 'logo' => UploadedFile::fake()->create('logo.svg', 5, 'image/svg+xml')], ['Accept' => 'application/json'])
            ->assertUnprocessable()->assertJsonValidationErrors('logo');

        $this->post("/api/admin/partners/{$id}", ['name' => 'RS Contoh', 'is_active' => '0', 'remove_logo' => '1'], ['Accept' => 'application/json'])
            ->assertOk()->assertJsonPath('logo_path', null);
        Storage::disk('public')->assertMissing(str_replace('/storage/', '', $partner->logo_path));
        $this->assertNotContains('RS Contoh', collect($this->getJson('/api/partners')->json())->pluck('name'));

        $this->deleteJson("/api/admin/partners/{$id}")->assertOk();
    }

    public function test_guests_cannot_manage_partners(): void
    {
        $this->postJson('/api/admin/partners', ['name' => 'x'])->assertUnauthorized();
    }

    public function test_contact_settings_use_official_values(): void
    {
        $this->getJson('/api/site-settings')
            ->assertJsonPath('address_street', 'Jl. Cendrawasih Raya No.87 RT.007/RW.006, Komplek Perumahan Imigrasi')
            ->assertJsonPath('email', 'info@klinikpondokmedika.id')
            ->assertJsonPath('instagram_url', 'https://www.instagram.com/pondokmedika/');
    }
}
