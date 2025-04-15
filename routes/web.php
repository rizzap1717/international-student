<?php

use App\Http\Controllers\AccreditationController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AchievementController;
use App\Http\Controllers\FrontController;
use App\Http\Controllers\MisionController;
use App\Http\Controllers\ProfilController; // This should be correct
use App\Http\Controllers\MissionController;
//ADMIN
use App\Http\Controllers\StructureController;
use App\Http\Controllers\StudyProgramController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\FacultiesController;
use App\Http\Controllers\HomeController;

   
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
 */

// Route::get('/', function () {
//     return redirect()->route('login');
// });

Auth::routes();

// Route::get('/test', function () {
//     return view('layouts.admin.dashboard');
// });
// Route::post('/login', [AuthController::class, 'login']);
// Route::post('/register', [AuthController::class, 'register']);


Route::get('/', [FrontController::class, 'welcome']); 
Route::get('/about', [FrontController::class, 'about'])->name('about');
Route::get('/faculty', [FrontController::class, 'faculty']);
Route::get('/structure', [FrontController::class, 'structure']);
Route::get('/news', [FrontController::class, 'news']);
Route::get('/visimisi', [FrontController::class, 'visimisi']);
Route::get('/newsDetail/{id}', [FrontController::class, 'newsDetail'])->name('newsDetail');
Route::get('/detailprodi', [FrontController::class, 'detailprodi']);
Route::get('/detailprodi/{id}', [FrontController::class, 'detailprodi'])->name('detailprodi');
Route::get('/get-study-program/{facultyName}', [FrontController::class, 'getStudyProgram']);
Route::get('/acreditation', [FrontController::class, 'acreditation'])->name('acreditation');
Route::get('/pendaftaran', [FrontController::class, 'registrationForm'])->name('register.form');
Route::post('/pendaftaran', [FrontController::class, 'processRegistration'])->name('register.store');
Route::get('/registration', [FrontController::class, 'emails/registration'])->name('registration');


Route::group(['prefix' => 'admin', 'middleware' => ['auth']], function () {
    Route::get('/dashboard', [HomeController::class, 'index'])->name('home');   
    // Route Organization Structure
    Route::get('structure', [StructureController::class, 'index'])->name('structure.index');
    Route::get('structure/create', [StructureController::class, 'create'])->name('structure.create');
    Route::post('structure', [StructureController::class, 'store'])->name('structure.store');
    Route::get('structure/{id}', [StructureController::class, 'show'])->name('structure.show');
    Route::get('structure/{id}/edit', [StructureController::class, 'edit'])->name('structure.edit');
    Route::put('structure/{id}', [StructureController::class, 'update'])->name('structure.update');
    Route::delete('structure/{id}', [StructureController::class, 'destroy'])->name('structure.destroy');

    // Route Study Program
    Route::get('studyprogram', [StudyProgramController::class, 'index'])->name('StudyProgram.index');
    Route::get('studyprogram/create', [StudyProgramController::class, 'create'])->name('StudyProgram.create');
    Route::post('studyprogram', [StudyProgramController::class, 'store'])->name('StudyProgram.store');
    Route::get('studyprogram/{id}', [StudyProgramController::class, 'show'])->name('StudyProgram.show');
    Route::get('studyprogram/{id}/edit', [StudyProgramController::class, 'edit'])->name('StudyProgram.edit');
    Route::put('studyprogram/{id}', [StudyProgramController::class, 'update'])->name('StudyProgram.update');
    Route::delete('studyprogram/{id}', [StudyProgramController::class, 'destroy'])->name('StudyProgram.destroy');

    // Route Faculty
    Route::get('faculty', [FacultiesController::class, 'index'])->name('faculties.index');
    Route::get('faculty/create', [FacultiesController::class, 'create'])->name('faculties.create');
    Route::post('faculty', [FacultiesController::class, 'store'])->name('faculties.store');
    Route::get('faculty/{id}', [FacultiesController::class, 'show'])->name('faculties.show');
    Route::get('faculty/{id}/edit', [FacultiesController::class, 'edit'])->name('faculties.edit');
    Route::put('faculty/{id}', [FacultiesController::class, 'update'])->name('faculties.update');
    Route::delete('faculty/{id}', [FacultiesController::class, 'destroy'])->name('faculties.destroy');


    // Route News
    Route::get('news', [NewsController::class, 'index'])->name('news.index');
    Route::get('news/create', [NewsController::class, 'create'])->name('news.create');
    Route::post('news', [NewsController::class, 'store'])->name('news.store');
    Route::get('news/{id}', [NewsController::class, 'show'])->name('news.show');
    Route::get('news/{id}/edit', [NewsController::class, 'edit'])->name('news.edit');
    Route::put('news/{id}', [NewsController::class, 'update'])->name('news.update');
    Route::delete('news/{id}', [NewsController::class, 'destroy'])->name('news.destroy');

    // Route Profil
    Route::get('profile', [ProfilController::class, 'index'])->name('profile.index');
    Route::get('profile/create', [ProfilController::class, 'create'])->name('profile.create');
    Route::post('profile', [ProfilController::class, 'store'])->name('profile.store');
    Route::get('profile/{id}', [ProfilController::class, 'show'])->name('profile.show');
    Route::get('profile/{id}/edit', [ProfilController::class, 'edit'])->name('profile.edit');
    Route::put('profile/{id}', [ProfilController::class, 'update'])->name('profile.update');
    Route::delete('profile/{id}', [ProfilController::class, 'destroy'])->name('profile.destroy');

    // Route Accreditation
    Route::get('accreditation', [AccreditationController::class, 'index'])->name('accreditation.index');
    Route::get('accreditation/upload', [AccreditationController::class, 'create'])->name('accreditation.create');
    Route::post('accreditation', [AccreditationController::class, 'store'])->name('accreditation.store');
    Route::get('accreditation/{id}', [AccreditationController::class, 'show'])->name('accreditation.show');
    Route::get('accreditation/{id}/edit', [AccreditationController::class, 'edit'])->name('accreditation.edit');
    Route::put('accreditation/{id}', [AccreditationController::class, 'update'])->name('accreditation.update');
    Route::delete('accreditation/{id}', [AccreditationController::class, 'destroy'])->name('accreditation.destroy');

    // Route Achievement
    Route::get('achievement', [AchievementController::class, 'index'])->name('achievement.index');
    Route::get('achievement/create', [AchievementController::class, 'create'])->name('achievement.create');
    Route::post('achievement', [AchievementController::class, 'store'])->name('achievement.store');
    Route::get('achievement/{id}', [AchievementController::class, 'show'])->name('achievement.show');
    Route::get('achievement/{id}/edit', [AchievementController::class, 'edit'])->name('achievement.edit');
    Route::put('achievement/{id}', [AchievementController::class, 'update'])->name('achievement.update');
    Route::delete('achievement/{id}', [AchievementController::class, 'destroy'])->name('achievement.destroy');


});
