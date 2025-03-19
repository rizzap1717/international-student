<?php

use App\Http\Controllers\AccreditationController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AchievementController;
use App\Http\Controllers\FrontController;
use App\Http\Controllers\MisionController;
use App\Http\Controllers\ProfilController; // This should be correct
use App\Http\Controllers\BannerController;
use App\Http\Controllers\MissionController;
// use App\Http\Controllers\LanguageController;
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
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);


Route::get('/', [FrontController::class, 'apiwelcome']); 
Route::get('/about', [FrontController::class, 'apiabout']);
Route::get('/faculty', [FrontController::class, 'apifaculty']);
Route::get('/structure', [FrontController::class, 'apistructure']);
Route::get('/news/{id}', [FrontController::class, 'apinews']);
Route::get('/visimisi', [FrontController::class, 'apivisimisi']);
Route::get('/newsDetail', [FrontController::class, 'apinewsDetail']);
Route::get('/newsDetail/{id}', [FrontController::class, 'apinewsDetail'])->name('newsDetail');
Route::get('/detailprodi', [FrontController::class, 'apidetailprodi']);
Route::get('/detailprodi/{id}', [FrontController::class, 'apidetailprodi'])->name('detailprodi');
Route::get('/acreditation', [FrontController::class, 'apiacreditation']);
// Route::get('/lang/{locale}', [LanguageController::class, 'apiswitchLang'])->name('lang.switch');


//lang
// Route::get('/lang/{locale}', [LanguageController::class, 'switchLang'])->name('switchLang');



Route::group(['prefix' => 'admin', 'middleware' => ['auth']], function () {
    Route::get('/dashboard', [App\Http\Controllers\HomeController::class, 'index'])->name('home');

    // Route Organization Structure
    Route::get('structure', [App\Http\Controllers\StructureController::class, 'index'])->name('structure.index');
    Route::get('structure/create', [App\Http\Controllers\StructureController::class, 'create'])->name('structure.create');
    Route::post('structure', [App\Http\Controllers\StructureController::class, 'store'])->name('structure.store');
    Route::get('structure/{id}', [App\Http\Controllers\StructureController::class, 'show'])->name('structure.show'); // Add this line
    Route::get('structure/{id}/edit', [App\Http\Controllers\StructureController::class, 'edit'])->name('structure.edit');
    Route::put('structure/{id}', [App\Http\Controllers\StructureController::class, 'update'])->name('structure.update');
    Route::delete('structure/{id}', [App\Http\Controllers\StructureController::class, 'destroy'])->name('structure.destroy');

    // Route Study Program
    Route::get('Study-Program', [App\Http\Controllers\StudyProgramController::class, 'index'])->name('StudyProgram.index');
    Route::get('Study-Program/create', [App\Http\Controllers\StudyProgramController::class, 'create'])->name('StudyProgram.create');
    Route::post('Study-Program', [App\Http\Controllers\StudyProgramController::class, 'store'])->name('StudyProgram.store');
    Route::get('Study-Program{id}', [App\Http\Controllers\StudyProgramController::class, 'show'])->name('StudyProgram.show');
    Route::get('Study-Program/{id}/edit', [App\Http\Controllers\StudyProgramController::class, 'edit'])->name('StudyProgram.edit');
    Route::put('Study-Program/{id}', [App\Http\Controllers\StudyProgramController::class, 'update'])->name('StudyProgram.update');
    Route::delete('Study-Program/{id}', [App\Http\Controllers\StudyProgramController::class, 'destroy'])->name('StudyProgram.destroy');

    // Route Faculty
    Route::get('faculty', [App\Http\Controllers\FacultiesController::class, 'index'])->name('faculties.index');
    Route::get('faculty/create', [App\Http\Controllers\FacultiesController::class, 'create'])->name('faculties.create');
    Route::post('faculty', [App\Http\Controllers\FacultiesController::class, 'store'])->name('faculties.store');
    Route::get('faculty{id}', [App\Http\Controllers\FacultiesController::class, 'show'])->name('faculties.show');
    Route::get('faculty/{id}/edit', [App\Http\Controllers\FacultiesController::class, 'edit'])->name('faculties.edit');
    Route::put('faculty/{id}', [App\Http\Controllers\FacultiesController::class, 'update'])->name('faculties.update');
    Route::delete('faculty/{id}', [App\Http\Controllers\FacultiesController::class, 'destroy'])->name('faculties.destroy');

    // Route News
    Route::get('news', [App\Http\Controllers\NewsController::class, 'index'])->name('news.index');
    Route::get('news/create', [App\Http\Controllers\NewsController::class, 'create'])->name('news.create');
    Route::post('news', [App\Http\Controllers\NewsController::class, 'store'])->name('news.store');
    Route::get('news{id}', [App\Http\Controllers\NewsController::class, 'show'])->name('news.show');
    Route::get('news/{id}', [App\Http\Controllers\NewsController::class, 'edit'])->name('news.edit');
    Route::put('news/{id}', [App\Http\Controllers\NewsController::class, 'update'])->name('news.update');
    Route::delete('news/{id}', [App\Http\Controllers\NewsController::class, 'destroy'])->name('news.destroy');

    // Route Profil
    Route::get('profil',[App\Http\Controllers\ProfilController::class, 'index'])->name('profil.index');
    Route::get('profil/create', [App\Http\Controllers\ProfilController::class, 'create'])->name('profil.create');
    Route::post('profil',[App\Http\Controllers\ProfilController::class, 'store'])->name('profil.store');
    Route::get('profil{id}',[App\Http\Controllers\ProfilController::class, 'show'])->name('profil.show');
    Route::get('profil/{id}/edit',[App\Http\Controllers\ProfilController::class, 'edit'])->name('profil.edit');
    Route::put('profil/{id}',[App\Http\Controllers\ProfilController::class, 'update'])->name('profil.update');
    Route::delete('profil/{id}',[App\Http\Controllers\ProfilController::class, 'destroy'])->name('profile.destroy');

    // Route Accreditation
    Route::get('/accreditation', [AccreditationController::class, 'index'])->name('accreditation.index');
    Route::get('/accreditation/upload', [AccreditationController::class, 'create'])->name('accreditation.create');
    Route::post('/accreditation', [AccreditationController::class, 'store'])->name('accreditation.store');
    Route::get('/accreditation/{id}', [AccreditationController::class, 'show'])->name('accreditation.show');
    Route::get('/accreditation/{id}/edit', [AccreditationController::class, 'edit'])->name('accreditation.edit');
    Route::put('/accreditation/{id}', [AccreditationController::class, 'update'])->name('accreditation.update');
    Route::delete('/accreditation/{id}', [AccreditationController::class, 'destroy'])->name('accreditation.destroy');

    // Route Achievement
    Route::get('/achievement', [AchievementController::class, 'index'])->name('achievement.index');
    Route::get('/achievement/create', [AchievementController::class, 'create'])->name('achievement.create');
    Route::post('/achievement', [AchievementController::class, 'store'])->name('achievement.store');
    Route::get('/achievement/{id}', [AchievementController::class, 'show'])->name('achievement.show');
    Route::get('/achievement/{id}/edit', [AchievementController::class, 'edit'])->name('achievement.edit');
    Route::put('/achievement/{id}', [AchievementController::class, 'update'])->name('achievement.update');
    Route::delete('/achievement/{id}', [AchievementController::class, 'destroy'])->name('achievement.destroy');


});
