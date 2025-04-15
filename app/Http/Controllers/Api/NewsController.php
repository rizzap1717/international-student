<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\News; // pastikan model News sudah ada

class NewsController extends Controller
{
    public function index()
    {
        // Ambil semua data dari tabel news
        $news = News::all();

        // Return dalam bentuk JSON
        return response()->json([
            'success' => true,
            'message' => 'List of News',
            'data' => $news
        ]);
    }
}
