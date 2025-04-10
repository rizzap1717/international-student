<?php

namespace App\Http\Controllers\Api;

use App\Models\Faculties;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class FacultiesController extends Controller
{
    // Menampilkan semua fakultas
    public function index(): JsonResponse
    {
        $faculties = Faculties::all();
        return response()->json([
            'success' => true,
            'message' => 'Daftar Fakultas',
            'faculties' => $faculties,
        ], 200);
    }

    // Menyimpan data fakultas baru
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'faculty_name' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        $faculties = Faculties::create([
            'faculty_name' => $request->faculty_name,
            'description' => $request->description,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Fakultas berhasil ditambahkan',
            'faculties' => $faculties,
        ], 201);
    }

    // Menampilkan fakultas berdasarkan ID
    public function show($id): JsonResponse
    {
        $faculties = Faculties::find($id);

        if (!$faculties) {
            return response()->json([
                'success' => false,
                'message' => 'Fakultas tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'faculties' => $faculties,
        ], 200);
    }

    // Memperbarui data fakultas
    public function update(Request $request, $id): JsonResponse
    {
        $request->validate([
            'faculty_name' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        $faculties = Faculties::find($id);
        if (!$faculties) {
            return response()->json([
                'success' => false,
                'message' => 'Fakultas tidak ditemukan',
            ], 404);
        }

        $faculties->update([
            'faculty_name' => $request->faculty_name,
            'description' => $request->description,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Data fakultas berhasil diperbarui',
            'faculties' => $faculties,
        ], 200);
    }

    // Menghapus fakultas
    public function destroy($id): JsonResponse
    {
        $faculties = Faculties::find($id);
        if (!$faculties) {
            return response()->json([
                'success' => false,
                'message' => 'Fakultas tidak ditemukan',
            ], 404);
        }

        $faculties->delete();

        return response()->json([
            'success' => true,
            'message' => 'Fakultas berhasil dihapus',
        ], 200);
    }
}
