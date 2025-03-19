@extends('layouts.frontend')
@section('content')
    <section id="visimisi" class="visi misi">
        <div class="container">
            <div class="card mb-3 card-large">
                <div class="row g-0">
                    <div class="col-md-4">
                        <img src="{{ asset('front/assets/img/kampus1.webp') }}" class="img-fluid rounded-start img-large" alt="...">
                    </div>
                    @foreach ($profile as $data)
                        
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">Vision</h5>
                            <p class="card-text"><b>{{$data->vission}}</b></p>
                        </div>
                    </div>
                    @endforeach
                </div>
            </div>
            <div class="card mb-3 card-large">
                <div class="row g-0">
                    <!-- Kolom Teks Kiri -->
                    <div class="col-md-8">
                        @foreach ($profile as $data)
                            
                        <div class="card-body">
                            <h5 class="card-title">Mission</h5>
                            <p class="card-text"><b>{{$data->mission}}</b></p>
                        </div>
                        @endforeach
                    </div>
                    <!-- Kolom Gambar Kanan -->
                    <div class="col-md-4 order-md-1">
                        <img src="{{ asset('front/assets/img/kampus2.webp') }}" class="img-fluid rounded-start img-large" alt="...">
                    </div>
                </div>
            </div>
            
        </div>
        
    </section>
@endsection
