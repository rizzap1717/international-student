@extends('layouts.admin.dashboard')

@section('content')
{{-- <body class="container-fluid">
<div class="row">
    <div class="span6" style="float: none; margin: 0 auto;">
        <div class="card">
            <table cellspacing="0" cellpadding="10">
                <tr>
                    <!-- Kolom untuk gambar -->
                    <td>
                        <img src="{{ asset('admin/assets/img/logo/halo.webp')}}" alt="Card Image" width="170">
                    </td>
        
                    <!-- Kolom untuk teks -->
                    <td>
                        <h3 class="card-title">International Students</h3>
                        <p>Welcome to Admin Dashboard International Students</p>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</div>
</body> --}}
<div class="dashboard-card animate__animated animate__fadeIn">
    <div class="card-header">
      <div class="header-title">
        <h2 class="animate__animated animate__fadeInDown">Admin Dashboard</h2>
        <p class="animate__animated animate__fadeInDown animate__delay-1s">Sistem Manajemen Website Mahasiswa Internasional</p>
      </div>
    </div>
    
    <div class="card-content">
      <div class="logo-container animate__animated animate__fadeInLeft">
        <img src="{{ asset('admin/assets/img/logo/halo.webp')}}" alt="HALO Logo">
      </div>
      
      <div class="content-text">
        <h3 class="animate__animated animate__fadeInRight">International Student</h3>
        <p>Selamat datang di dasbor administrasi untuk mahasiswa internasional.</p>
      </div>
    </div>
  </div>

@endsection
