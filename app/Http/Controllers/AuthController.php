<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            // Jika berhasil login, redirect ke dashboard
            return redirect()->route('home');
        }

        // Jika gagal login, kembali ke halaman login dengan error
        return back()->withErrors(['email' => 'Email atau password salah!']);
    }

    public function register(Request $request)
    {
        return response()->json(['message' => 'Register API not implemented yet'], 200);
    }
}
