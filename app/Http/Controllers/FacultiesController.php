<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Faculties;
use App\Models\Lecturer;
use Illuminate\Http\Request;
use PharIo\Manifest\Author;
use Illuminate\Support\Facades\Session;
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

    public function destroy($id)
    {
        if(!Faculties::destroy($id)){
            return redirect()->back();
        }

       Alert::error('Error Title', 'Error Message');
        $faculties = Faculties::findOrFail($id);
        $faculties->delete();

        return redirect()->route('faculties.index')->with('danger', 'Data has been deleted!');
    }
}
