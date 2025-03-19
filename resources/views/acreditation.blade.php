@extends('layouts.frontend')
@section('content')
   <!-- Values Section -->
    <section id="acreditation" class="acreditation section">

      <!-- Section Title -->
      <div class="container section-title" data-aos="fade-up">
        <h2>Acreditation</h2>
        <p>International Students<br></p>
      </div><!-- End Section Title -->

      <div class="container">

        <div class="row gy-4">
        @foreach ($akred as $data)
          <div class="col-lg-4" data-aos="fade-up" data-aos-delay="100">
            <div class="card">
                <img src="{{asset('images/accreditation_picture/'.$data->accreditation_picture)}}" alt="">
              <h5>{{$data->accreditation_name}}</h5>
            </div>
          </div><!-- End Card Item -->
          @endforeach
        </div>
      </div>
    </section><!-- /Values Section -->
    <section id="blog-pagination" class="blog-pagination section">
      <ul class="pagination justify-content-center">
        @for ($i = 1; $i <= $akred->lastPage(); $i++)
            <li class="page-item {{ ($akred->currentPage() == $i) ? 'active' : '' }}">
                <a class="page-link" href="{{ $akred->url($i) }}">{{ $i }}</a>
            </li>
        @endfor
    </ul>
  </section><!-- /Blog Pagination Section -->
@endsection