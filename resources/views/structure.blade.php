@extends('layouts.frontend')
@section('content')
    <!-- Team Section -->
    <section id="team" class="team section">

        <!-- Section Title -->
        <div class="container section-title" data-aos="fade-up">
            <h1 style="color: white; font-weight: bold; padding: 10px; border-radius: 8px; font-size: 2em;">
                Organization
              </h1>
              
        </div><!-- End Section Title -->

        <div class="container_struktur d-flex flex-column align-items-center">

            <!-- Director Card -->
            <div class="director-wrapper mb-4">
                <div class="card_struktur">
                    <div class="image-container_struktur">
                        <img src="{{ asset('front/assets/img/dir.webp') }}" alt="Director">
                        <div class="overlay">
                            <p class="overlay-text"><b>Director</b></p>
                        </div>
                    </div>
                </div>
            </div>
        
            <!-- Staff Cards -->
            <div class="grid-wrapper">
                @foreach ($structure as $data)
                    <div class="card_struktur">
                        <div class="image-container_struktur">
                            <img src="{{ asset('images/structure/' . $data->picture) }}" alt="{{ $data->structure_name }}">
                            <div class="overlay">
                                <p class="overlay-text"><b>{{ $data->structure_name }}</b></p>
                                <p class="overlay-text"><b>{{ $data->position }}</b></p>
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>
        
        </div>
            


    </section><!-- /Team Section -->
@endsection
