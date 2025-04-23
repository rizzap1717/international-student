<?php
namespace App\Http\Controllers;

use App\Models\News;
use App\Models\Profil;
use App\Models\Accreditation;
use App\Models\Achievement;
use App\Models\Faculties;
use App\Models\StudyProgram;
use App\Models\Structure;
use App\Models\Registration;
use App\Mail\Pendaftaran;
use Illuminate\Http\Request;

class FrontController extends Controller
{
    // Halaman daftar berita
    public function news()
{
    $news = News::paginate(3);
    $title = 'News Page'; // atau judul sesuai kebutuhan kamu
    return view('news', compact('news', 'title'));
}


    // Halaman detail berita berdasarkan ID
    public function newsDetail($id)
    {
        $news = News::find($id);
        if (!$news) {
            abort(404, 'Berita tidak ditemukan');
        }
        return view('newsdetail', compact('news'));
    }

    // Halaman daftar fakultas dan prodi
    public function faculty()
{
    $prody1 = StudyProgram::with('faculties')->get();
    $prody2 = StudyProgram::with('faculties')->get();
    $prody3 = StudyProgram::with('faculties')->get();
    $faculties = Faculties::with('studyPrograms')->get();
    return view('faculty', compact('faculties','prody1','prody2','prody3'));
}

public function getStudyProgram(Request $request,$id)
{
    $programs = StudyProgram::where('faculty_id', $id)->get();

    return response()->json($programs);
}


    // Halaman detail program studi
    public function detailProdi($id)
    {
        $prody = StudyProgram::find($id);
        if (!$prody) {
            abort(404, 'Program studi tidak ditemukan');
        }
        return view('detailprodi', compact('prody'));
    }

    // Halaman prestasi
    public function achievement()
    {
        $achievements = Achievement::all();
        return view('achievement.index', compact('achievements'));
    }

    // Halaman akreditasi
    public function acreditation()
    {
    $akred = Accreditation::paginate(6); // ambil semua data akreditasi
    return view('acreditation', compact('akred')); 
    }

    // Halaman Visi Misi / Profil
    public function showVisimisi()
    {
    $profile = Profil::all();
    return view('visimisi', compact('profile'));
    }
    public function visimisi(Request $request)
    {
    dd($request->all());
    Profil::create($request->only(['vission', 'mission']));
    $profile = Profil::latest()->first();
    return view('visimisi', compact('profile'));
    }

    public function structure()
    {
    $structure = Structure::all(); // ambil semua data struktur organisasi
    return view('structure', compact('structure'));
    }

    // Halaman utama (beranda)
    public function welcome() 
    {
        $news = News::paginate(3);
        $achievement = Achievement::all();
        $accreditation = Accreditation::all();
        return view('user.welcome', compact('news', 'accreditation', 'achievement'));
    }

    // Halaman About
    public function about()
    {
        return view('about');
    }
    // Halaman Form Pendaftaran
public function registrationForm()
{
    $faculties = Faculties::all(); 
    return view('registrationForm',compact('faculties'));   
}

// Menyimpan data pendaftaran
public function processRegistration(Request $request)
{
    
    $request->validate([
        'name' => 'required|string|max:255',
        'address' => 'required|string',
        'dob' => 'required|date',
        'faculty' => 'required|integer',
        'study_program' => 'required|integer',
        'country' => 'required|string|max:100',
        'phone' => 'required|string|max:20',
        'email' => 'required|email|max:255',
    ]);

    // Simpan data ke database
    Registration::create([
        'name' => $request->name,
        'address' => $request->address,
        'dob' => $request->dob,
        'faculty' => $request->faculty,
        'program' => $request->study_program,
        'country' => $request->country,
        'phone' => $request->phone,
        'email' => $request->email,
    ]);

    // Redirect ke halaman terima kasih
    return redirect()->route('register.thankyou');
}


public function showRegistrations()
{
    $pendaftarans = Registration::OrderBy('created_at', 'desc')->paginate(10); // ambil semua data pendaftaran
    return view('admin.operator', compact('pendaftarans'));
}

public function accept($id)
{
    $registration = Registration::findOrFail($id);
    $registration->status = 'accepted';
    $registration->save();

    return redirect()->back()->with('success', 'Pendaftaran berhasil diterima.');
}

}
