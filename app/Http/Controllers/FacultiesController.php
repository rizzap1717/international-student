<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Faculties;
use App\Models\Lecturer;
use Illuminate\Http\Request;
use PharIo\Manifest\Author;
use Illuminate\Support\Facades\Session;
use RealRashid\SweetAlert\Facades\Alert;

class FacultiesController extends Controller
{
    public function index()
    {
        $faculties = Faculties::all();

        return view('admin.faculties.index', compact('faculties'));
    }

    public function indexapi()
    {
        $faculties = Faculties::all();
        $res = [
            'success' => true,
            'message' => 'Daftar Fakultas',
            'faculties' => $faculties,
        ];
        return response()->json($res, 200);
    } 

    public function create()
    {
        $faculties = Faculties::all();

        return view('admin.faculties.create', compact('faculties'));
    }


    public function show($id)
    {
        $faculties = Faculties::findOrFail($id);

        return view('admin.faculties.create', compact('faculties'));
    }

    public function store(Request $request)
    {
        // Validasi input
        $request->validate([
            'faculty_name' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        // Buat instance baru untuk model Faculties
        $faculties = new Faculties();
        $faculties->faculty_name = $request->faculty_name;
        $faculties->description = $request->description;

        $faculties->save(); // Simpan data ke database

        // Redirect ke halaman index fakultas
        return redirect()->route('faculties.index')->with('success', 'Data has been added!');
        ;
    }

    public function storeapi(Request $request)
    {

        $faculties = faculties::create([
            'faculty_name' => $request->faculty_name, 
            'description' => $request->description, 
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Fakultas berhasil ditambahkan',
            'faculties' => $faculties
        ], 201);
    }


    public function edit($id)
    {
        $faculties = Faculties::findOrFail($id); // Ubah $faculties menjadi $faculties

        return view('admin.faculties.edit', compact('faculties'));
    }

    public function update(Request $request, $id)
    {
        // Validasi input
        $request->validate([
            'faculty_name' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        // Buat instance baru untuk model Faculties
        $faculties = Faculties::findOrFail($id);
        $faculties->faculty_name = $request->faculty_name;
        $faculties->description = $request->description;

        $faculties->save(); // Simpan data ke database

        return redirect()->route('faculties.index')->with('warning', 'Data has been updated!');
    }

    public function updateapi(Request $request, $id)
    {
        $faculties = faculties::find($id);
        if ($faculties) {
            $faculties->faculty_name = $request->faculty_name;
            $faculties->description = $request->description;
            $faculties->save();
            return response([
                'success' => true,
                'message' => 'Data berhasil diperbarui',
                'data' => $faculties,
            ],200 );
        } else {
            return response()->json([
                'success'=> false,
                'message'=> 'data gagal diperbarui'
            ]);
        }   
    }



    public function destroy($id)
{
    try {
        $faculty = Faculties::findOrFail($id);

        // Cek apakah ada study program sebelum menghapus
        if ($faculty->studyPrograms()->exists()) {
            return redirect()->route('faculties.index')->with('error', 'Fakultas masih memiliki program studi dan tidak dapat dihapus.');
        }

        $faculty->delete(); // Pastikan ini tidak di-bypass

        Alert::success('Berhasil!', 'Fakultas berhasil dihapus.');
    } catch (\Exception $e) {
        Alert::error('Gagal!', 'Terjadi kesalahan: ' . $e->getMessage());
    }

    return redirect()->route('faculties.index');
}


    public function deleteapi($id)
    {
        $faculties = faculties::find($id);

        if (!$faculties) {
            return response()->json(['success' => false, 'message' => 'faculties not found'], 404);
        }

        $faculties->delete();

        return response()->json([
            'success' => true,
            'message' => 'faculties deleted successfully'
        ]);
    }
//     public function getFaculties()
// {
//     $data = Faculties::all()->map(function ($faculties) {
//         return $faculties;
//     });

//     return response()->json([
//         'status' => 'success',
//         'data' => $data
//     ]);
// }
}
