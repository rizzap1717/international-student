<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    use AuthenticatesUsers;

    // ❌ Hapus ini kalau ada:
    // protected $redirectTo = '/admin/dashboard';

    /**
     * Redirect setelah login tergantung role user
     */
    protected function redirectTo()
    {
        if (Auth::check()) {
            $role = Auth::user()->role;

            if ($role === 'admin') {
                return '/admin/dashboard';
            } elseif ($role === 'operator') {
                return '/admin/operator';
            }
        }

        // Role tidak dikenali → lempar 403
        abort(403, 'Unauthorized action.');
    }

    public function __construct()
    {
        $this->middleware('guest')->except('logout');
        $this->middleware('auth')->only('logout');
    }
}
