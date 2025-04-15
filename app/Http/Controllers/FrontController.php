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
    return view('faculty', compact('faculties','prody4','prody2','prody3'));
}

public function getStudyProgram($facultyName)
{
    // Ambil program studi berdasarkan nama fakultas
    $programs = StudyProgram::whereHas('faculties', function ($query) use ($facultyName) {
        $query->where('faculty_name', $facultyName);
    })->get();

    return response()->json($programs);
}


    // Halaman detail program studi
    public function detailProdi($id)
    {
        $prody = StudyProgram::find($id);
        if (!$prody) {
            abort(404, 'Program studi tidak ditemukan');
        }
        return view('studyprogram.detail', compact('prody'));
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
    return view('acreditation', compact('akred')); // sesuaikan view-nya
}

    // Halaman Visi Misi / Profil
    public function visimisi()
    {
    $profile = Profil::all(); // Ambil data dari tabel profil
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
    return view('registrationForm'); // view: resources/views/registration/form.blade.php
}

// Menyimpan data pendaftaran
public function processRegistration(Request $request)
{
    // Validasi data
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'address' => 'required|string|max:255',
        'dob' => 'required|date',
        'faculty' => 'required|string',
        'program' => 'required|string',
        'phone' => 'required|string',
        'country' => 'required|string',
    ]);

    // Kirim email atau simpan ke database
    Mail::to('rizkiap775@gmail.com')->send(new RegistrationMail($validated));

    // Setelah pengiriman berhasil
    return back()->with('success', 'Pendaftaran berhasil!');
}
public function registration()
{
    return view('emails/registration'); 
}


}
