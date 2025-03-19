@extends('layouts.frontend')
@section('content')
<section id="prodi" class="prodi section">
    <section class="prodi-detail">
        <div class="container">
            <h1>{{($prody->prody_name)}}</h1>
            <img src="{{asset('front/assets/img/sertifikat_AKEd3.jpg')}}" alt="">
            <div class="prodi-info">
                <div class="content">
                    {{-- <p><strong>Deskripsi:</strong> Program Studi Teknik Informatika bertujuan untuk menghasilkan lulusan yang memiliki kompetensi di bidang teknologi informasi dan komunikasi, siap menghadapi tantangan industri 4.0.</p>
                    <h2>Tujuan Program Studi</h2>
                    <ul>
                        <li>Menyediakan pendidikan berkualitas di bidang Informatika</li>
                        <li>Melatih mahasiswa untuk menjadi profesional di bidang teknologi informasi</li>
                        <li>Meningkatkan kemampuan penelitian dan pengembangan di bidang IT</li>
                    </ul>
                    <h2>Kurikulum</h2>
                    <p>Program Studi Teknik Informatika menawarkan kurikulum yang mencakup berbagai mata kuliah, seperti algoritma, pengembangan perangkat lunak, jaringan komputer, dan kecerdasan buatan.</p>
                    <h2>Karir Lulusan</h2>
                    <p>Lulusan dari program ini dapat bekerja di berbagai sektor, termasuk pengembangan perangkat lunak, manajemen IT, dan keamanan jaringan.</p> --}}
                    <textarea cols="85px" rows="10px" style="background-color: white" disabled> {{ $prody->description }}</textarea>
                </div>
            </div>
        </div>
    </section>
</section>
@endsection