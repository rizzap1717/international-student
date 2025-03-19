@extends('layouts.frontend')
@section('content')
    <main class="main">

        <!-- Page Title -->
        <div class="page-title">
            <div class="heading">
                <div class="container">
                    <div class="row d-flex justify-content-center text-center">
                        <div class="col-lg-8">
                            <h1>News</h1>
                        </div>
                    </div>
                </div>
            </div>
            <nav class="breadcrumbs">
                <div class="container">
                    <ol>
                        <li><a href="{{ url('/') }}">Home</a></li>
                        <li class="current">News</li>
                    </ol>
                </div>
            </nav>
        </div><!-- End Page Title -->

        <div class="container">
            <div class="col-lg-12">
                <!-- Blog Posts Section -->
                <section id="blog-posts" class="blog-posts section">
                    <div class="container_news">
                        <div class="row gy-4">
                            @foreach ($news as $data)
                                <div class="col-lg-4 col-md-6 col-sm-12" data-aos="fade-up" data-aos-delay="100">
                                    <article>
                                        <div class="post-img">
                                            <img src="{{ asset('images/news_picture/' . $data->news_picture) }}" alt="" class="img-fluid">
                                        </div>
                                        <h2 class="title">
                                            <a href="{{ route('newsDetail', $data->id) }}"><b>{{ $data->title }}</b></a>
                                        </h2>
                                        <div class="meta-top">
                                            <ul>
                                                <li class="d-flex align-items-center"><i class="bi bi-person"></i> {{ $data->authors }}</li>
                                                <li class="d-flex align-items-center"><i class="bi bi-clock"></i> <time>{{ $data->date }}</time></li>
                                            </ul>
                                        </div>
                                        <br>
                                        <div class="read-more">
                                            <a href="{{ route('newsDetail', $data->id) }}">Read More</a>
                                        </div>
                                    </article>
                                </div>
                            @endforeach
                        </div><!-- End blog posts list -->
                    </div>
                </section><!-- /Blog Posts Section -->

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
        </div>

  </main>
@endsection