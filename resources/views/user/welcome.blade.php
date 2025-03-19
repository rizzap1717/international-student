
@extends('layouts.frontend')
@section('content')

<div class="slider-container">
  <div class="slider">
      <img src="{{ asset('front/assets/img/mahasiswa1.webp') }}" alt="Gambar 1" class="slide">
      <br>
      <img src="{{ asset('front/assets/img/mahasiswa2.webp') }}" alt="Gambar 2" class="slide">
      <br>
      <img src="{{ asset('front/assets/img/mahasiswa2.webp') }}" alt="Gambar 3" class="slide">
  </div>
</div>


    <!-- About Section -->
    <section id="about" class="about section">

      <div class="container" data-aos="fade-up">
        <div class="row gx-0">
        
          <div class="col-lg-6 d-flex flex-column justify-content-center" data-aos="fade-up" data-aos-delay="200"> 
            <div class="content">
              <h2>International Students</h2>
              <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aspernatur officia libero eveniet laboriosam quibusdam architecto rem ipsum sequi reprehenderit? Tempore quis sint autem nesciunt atque ea deleniti doloremque voluptates asperiores!
              </p>
              <div class="text-center text-lg-start">
                <a href="{{('about')}}" class="btn-read-more d-inline-flex align-items-center justify-content-center align-self-center">
                  <span>Read More</span>
                  <i class="bi bi-arrow-right"></i>
                </a>
              </div>
            </div>
          </div>

          <div class="col-lg-6 d-flex align-items-center" data-aos="zoom-out" data-aos-delay="200">
            <img src="{{ asset('front/assets/img/kampus1.webp') }}" class="img-fluid" alt="">
          </div>

        </div>
      </div>

    </section><!-- /About Section -->

    <!-- Values Section -->
    <section id="values" class="values section">

      <!-- Section Title -->
      <div class="container section-title" data-aos="fade-up">
        <h2>Acreditation</h2>
        <p>International Students<br></p>
      </div><!-- End Section Title -->

      <div class="container">

        <div class="swiper-container">
          <div class="swiper-wrapper">
            @foreach ($accreditation as $data)
            <div class="swiper-slide">
                <img src="{{asset('images/accreditation_picture/'.$data->accreditation_picture)}}" alt="">
            </div>
            @endforeach
            
            <!-- Duplikat Slide untuk Efek Loop Mulus -->
            @foreach ($accreditation as $data)
            <div class="swiper-slide">
                <img src="{{asset('images/accreditation_picture/'.$data->accreditation_picture)}}" alt="">
            </div>
            @endforeach
          </div>
        </div>
        
        

      </div>

    </section><!-- /Values Section -->

    <!-- Recent Posts Section -->
    <section id="recent-posts" class="recent-posts section">

      <!-- Section Title -->
      <div class="container section-title" data-aos="fade-up">
        <h2>News Posts</h2>
        <p>Recent posts form our news</p>
      </div><!-- End Section Title -->

      <div class="container">

        <div class="row gy-5">
          @foreach ($news as $data)
              
          <div class="col-xl-4 col-md-6">
            <div class="post-item position-relative h-100" data-aos="fade-up" data-aos-delay="100">

              <div class="post-img position-relative overflow-hidden">
                <img src="{{ asset('images/news_picture/' . $data->news_picture) }}" alt="" class="img-fluid">
                <span class="post-date">{{$data->date}}</span>
              </div>

              <div class="post-content d-flex flex-column">

                <h3 class="post-title">{{$data->title}}</h3>

                <hr>
                
                <a href="{{ route('newsDetail',$data->id) }}"class="readmore stretched-link"><span>Read More</span><i class="bi bi-arrow-right"></i></a>
              </div>

            </div>
          </div><!-- End post item -->
          @endforeach
          <!-- Blog Pagination Section -->
          <section id="blog-pagination" class="blog-pagination section">
            <ul class="pagination justify-content-center">
              @for ($i = 1; $i <= $news->lastPage(); $i++)
                  <li class="page-item {{ ($news->currentPage() == $i) ? 'active' : '' }}">
                      <a class="page-link" href="{{ $news->url($i) }}">{{ $i }}</a>
                  </li>
              @endfor
          </ul>
        </section><!-- /Blog Pagination Section -->
              </div>
          </div><!-- End post item -->
    </section><!-- /Recent Posts Section -->

    <section id="achievement" class="achievement section">
      <div class="container_achievement custom-swiper">
        <!-- Wrapper untuk Swiper -->
        <div class="swiper-wrapper">
          @foreach ($achievement as $data)
            <div class="swiper-slide">
              <img src="{{ asset('images/achievement_picture/' . $data->achievement_picture) }}" width="300px" alt="Achievement">
            </div>
          @endforeach
        </div>
      </div>
    </section>
    

  
@endsection
