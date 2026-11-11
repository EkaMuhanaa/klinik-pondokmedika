<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Tests\TestCase;

class AdminSecurityTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_login_and_access_protected_route(): void
    {
        User::factory()->create(['email' => 'admin@example.com', 'password' => 'rahasia123']);

        $token = $this->postJson('/api/admin/login', [
            'email' => 'admin@example.com',
            'password' => 'rahasia123',
        ])->assertOk()->json('token');

        $this->withToken($token)->getJson('/api/admin/user')->assertOk();
    }

    public function test_protected_routes_reject_guests(): void
    {
        $this->getJson('/api/admin/user')->assertUnauthorized();
        $this->postJson('/api/admin/articles', [])->assertUnauthorized();
    }

    public function test_login_is_rate_limited(): void
    {
        User::factory()->create(['email' => 'admin@example.com']);

        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/admin/login', [
                'email' => 'admin@example.com',
                'password' => 'salah',
            ])->assertUnauthorized();
        }

        $this->postJson('/api/admin/login', [
            'email' => 'admin@example.com',
            'password' => 'salah',
        ])->assertTooManyRequests();
    }

    public function test_tokens_expire(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('admin_token')->plainTextToken;

        $this->travel(Config::get('sanctum.expiration') + 1)->minutes();

        $this->withToken($token)->getJson('/api/admin/user')->assertUnauthorized();
    }

    public function test_cors_only_allows_configured_origins(): void
    {
        $allowed = $this->withHeaders(['Origin' => 'http://localhost:5173'])->getJson('/api/facilities');
        $allowed->assertHeader('Access-Control-Allow-Origin', 'http://localhost:5173');

        $denied = $this->withHeaders(['Origin' => 'https://evil.example'])->getJson('/api/facilities');
        $this->assertNotSame('https://evil.example', $denied->headers->get('Access-Control-Allow-Origin'));
        $this->assertNotSame('*', $denied->headers->get('Access-Control-Allow-Origin'));
    }
}
