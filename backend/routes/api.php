<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\SliderImageController;
use App\Http\Controllers\Api\FacilityController;
use App\Http\Controllers\Api\PromoController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\DoctorController;
use App\Http\Controllers\Api\SiteSettingController;

// Auth Route
// Max 5 percobaan login per menit per IP untuk mencegah brute force
Route::post("/admin/login", [AuthController::class, "login"])->middleware("throttle:5,1");

// Public API
Route::get("/articles", [ArticleController::class, "index"]);
Route::get("/articles/{slug}", [ArticleController::class, "show"]);
Route::get("/settings/{key}", [SettingController::class, "show"]);
Route::get("/sliders/{page}", [SliderImageController::class, "index"]);
Route::get("/facilities", [FacilityController::class, "index"]);
Route::get("/facilities/{id}", [FacilityController::class, "show"]);
Route::get("/site-settings", [SiteSettingController::class, "index"]);
Route::get("/promos/active", [PromoController::class, "active"]);
Route::get("/services", [ServiceController::class, "index"]);
Route::get("/doctors", [DoctorController::class, "index"]);

// Protected API (Admin)
Route::middleware("auth:sanctum")->group(function () {
    Route::post("/admin/logout", [AuthController::class, "logout"]);
    
    Route::get("/admin/user", function (Request $request) {
        return $request->user();
    });

    Route::post("/admin/settings/upload-background", [SettingController::class, "uploadBackground"]);

    // Admin Article Routes (store, update, destroy)
    Route::post("/admin/articles", [ArticleController::class, "store"]);
    Route::post("/admin/articles/{id}", [ArticleController::class, "update"]); // using POST for update to handle multipart/form-data
    Route::delete("/admin/articles/{id}", [ArticleController::class, "destroy"]);

    // Admin Slider Routes
    Route::post("/admin/sliders", [SliderImageController::class, "store"]);
    Route::delete("/admin/sliders/{id}", [SliderImageController::class, "destroy"]);

    // Admin Facilities Routes
    Route::post("/admin/facilities", [FacilityController::class, "store"]);
    Route::post("/admin/facilities/{id}", [FacilityController::class, "update"]); // using POST for update to handle multipart/form-data
    Route::delete("/admin/facilities/{id}", [FacilityController::class, "destroy"]);

    // Admin Pengaturan Klinik (alamat, kontak, jam, media sosial, SEO)
    Route::put("/admin/site-settings", [SiteSettingController::class, "update"]);

    // Admin Pop-Up Promo
    Route::get("/admin/promos", [PromoController::class, "index"]);
    Route::get("/admin/promos/{id}", [PromoController::class, "show"]);
    Route::post("/admin/promos", [PromoController::class, "store"]);
    Route::post("/admin/promos/{id}", [PromoController::class, "update"]); // POST agar bisa multipart/form-data
    Route::delete("/admin/promos/{id}", [PromoController::class, "destroy"]);

    // Admin Layanan
    Route::get("/admin/services", [ServiceController::class, "adminIndex"]);
    Route::get("/admin/services/{id}", [ServiceController::class, "show"]);
    Route::post("/admin/services", [ServiceController::class, "store"]);
    Route::put("/admin/services/{id}", [ServiceController::class, "update"]);
    Route::delete("/admin/services/{id}", [ServiceController::class, "destroy"]);

    // Admin Dokter
    Route::get("/admin/doctors", [DoctorController::class, "adminIndex"]);
    Route::get("/admin/doctors/{id}", [DoctorController::class, "show"]);
    Route::post("/admin/doctors", [DoctorController::class, "store"]);
    Route::post("/admin/doctors/{id}", [DoctorController::class, "update"]); // POST agar bisa multipart/form-data
    Route::delete("/admin/doctors/{id}", [DoctorController::class, "destroy"]);
});

