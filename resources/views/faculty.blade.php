@extends('layouts.frontend')
@section('content')
    {{-- faculty section --}}
    <section id="faculty" class="faculty-section" style="padding: 60px 0; background-color: #ffffff;">
        <div class="container section-faculty" data-aos="fade-up" style="text-align: center; margin-bottom: 30px;">
            <p class="p_fakultas" style="font-size: 24px; font-weight: 600;">List of Faculties and Study Programs</p>
        </div>

        <div class="faculty-container" style="display: flex; justify-content: center; flex-wrap: wrap; gap: 20px;">
            @foreach ($faculties as $data)
                <div class="faculty-card" 
                    style="cursor: pointer; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); 
                        padding: 20px; width: 250px; transition: 0.3s ease;"
                    onclick="scrollToSection('faculty-{{ $data->id }}')"
                    onmouseover="this.style.transform='translateY(-5px)'"
                    onmouseout="this.style.transform='translateY(0)'">
                    <h2 style="font-size: 18px; color: #00aaff;">{{ $data->faculty_name }}</h2>
                    <p style="font-size: 14px; color: #333;">{{ $data->description }}</p>
                </div>
            @endforeach
        </div>
    </section>
    {{-- faculty section end --}}

    @foreach ($faculties as $faculty)
        <section id="faculty-{{ $faculty->id }}" class="prodi-section" style="padding: 60px 0;">
            <div class="container section-faculty" data-aos="fade-up" style="text-align: center; margin-bottom: 30px;">
                <p class="p_fakultas" style="font-size: 22px; font-weight: 600;">
                    {{ $faculty->faculty_name }} Study Program
                </p>
            </div>
            <div class="row-prodi" style="display: flex; justify-content: center; flex-wrap: wrap; gap: 20px;">
                @foreach ($faculty->studyPrograms as $data)
                    <div class="column-prodi" style="width: 250px;">
                        <div class="card-prodi" style="background: white; padding: 20px; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                            <h2 style="font-size: 18px; color: #333;">{{ $data->prody_name }}</h2>
                            <a type="button" class="btn btn-primary mt-2" href="{{ route('detailprodi', $data->id) }}">
                                Read More
                            </a>
                        </div>
                    </div>
                @endforeach
            </div>
        </section>
    @endforeach

@endsection
