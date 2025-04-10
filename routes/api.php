<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FacultiesController;
use App\Http\Controllers\NewsController;

// API Fakultas (Tanpa Login)
Route::prefix('faculties')->name('faculties.')->group(function () {
    Route::get('/', [FacultiesController::class, 'index'])->name('index'); // Ambil semua fakultas
    Route::get('/{id}', [FacultiesController::class, 'show'])->name('show'); // Ambil fakultas berdasarkan ID
});

// API Berita (Tanpa Login)
Route::prefix('news')->group(function () {
    Route::get('/', [NewsController::class, 'index']); // Ambil semua berita
    Route::get('/{id}', [NewsController::class, 'show'])->name('show'); // Ambil berita berdasarkan ID
});

// API dengan Autentikasi (Login Diperlukan)
Route::middleware('auth:sanctum')->group(function () {
    // Hanya endpoint ini yang butuh login
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    
    // API Fakultas (CRUD selain GET membutuhkan login)
    Route::prefix('faculties')->group(function () {
        Route::post('/', [FacultiesController::class, 'store'])->name('store');
        Route::put('/{id}', [FacultiesController::class, 'update'])->name('update');
        Route::delete('/{id}', [FacultiesController::class, 'destroy'])->name('destroy');
    });

    // API Berita (CRUD selain GET membutuhkan login)
    Route::prefix('news')->group(function () {
        Route::post('/', [NewsController::class, 'storeapi']);
    });

    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);
});
