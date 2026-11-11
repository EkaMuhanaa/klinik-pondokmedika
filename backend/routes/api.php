<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\SliderImageController;
use App\Http\Controllers\Api\FacilityController;

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
});

