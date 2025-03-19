@extends('layouts.frontend')
@section('content')
    <!-- Team Section -->
    <section id="team" class="team section">

        <!-- Section Title -->
        <div class="container section-title" data-aos="fade-up">
            <h1><b>Organization</b></h1>
        </div><!-- End Section Title -->

        <div class="container_struktur">

            <div class="row gy-4 justify-content-center align-items-center">
                <div class="image-container_struktur">
                <img src="{{ asset('front/assets/img/dir.webp') }}" alt="">
                <div class="overlay">
                    <p class="overlay-text"><b>Director</b></p>
                </div>
            </div>
                @foreach ($structure as $data)
                    <div class="card_struktur">
                        <div class="image-container_struktur">
                            <img src="{{ asset('images/structure/' . $data->picture) }}" alt="{{ $data->structure_name }}">
                            <div class="overlay">
                                <p class="overlay-text"><b>{{ $data->structure_name }}</b></p>
                                <p class="overlay-text"><b>{{$data->position}}</b></p>
                            </div>
                        </div>
                    </div>
                    @endforeach
            <br>
            <br>
            
                    </div>
                    
            </div>
            


    </section><!-- /Team Section -->
@endsection
