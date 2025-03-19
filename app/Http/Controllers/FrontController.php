<?php
namespace App\Http\Controllers;

use App\Models\News;
use App\Models\Profil;
use App\Models\Accreditation;
use App\Models\Achievement;
use App\Models\Faculties;
use App\Models\StudyProgram;
use Illuminate\Http\Request;

class FrontController extends Controller
{
    // API untuk mengambil semua berita
    public function apiNews()
    {
        return response()->json(News::paginate(3));
    }

    // API untuk mengambil detail berita berdasarkan ID
    public function apiNewsDetail($id)
    {
        $news = News::find($id);
        if (!$news) {
            return response()->json(['message' => 'News not found'], 404);
        }
        return response()->json($news);
    }

    // API untuk mengambil semua fakultas dan prodi
    public function apiFaculty()
    {
        $faculties = Faculties::with('studyPrograms')->get();
        return response()->json($faculties);
    }

    // API untuk detail program studi berdasarkan ID
    public function apiDetailProdi($id)
    {
        $prody = StudyProgram::find($id);
        if (!$prody) {
            return response()->json(['message' => 'Study Program not found'], 404);
        }
        return response()->json($prody);
    }

    // API untuk daftar prestasi
    public function apiAchievement()
    {
        return response()->json(Achievement::all());
    }

    // API untuk daftar akreditasi
    public function apiAccreditation()
    {
        return response()->json(Accreditation::paginate(6));
    }

    // API untuk mengambil data visi misi
    public function apiVisimisi()
    {
        return response()->json(Profil::all());
    }
    public function welcome() 
    {
    $news = News::paginate(3);
    $achievement = Achievement::all();
    $accreditation = Accreditation::all();
    
    return view('user.welcome', compact('news', 'accreditation', 'achievement'));
    }

}
