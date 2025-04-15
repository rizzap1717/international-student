@extends('layouts.frontend')
@section('content')
 <main class="main">

    <!-- Page Title -->
    <div class="page-title">
      <div class="heading">
        <div class="container_detail">
          <div class="row d-flex justify-content-center text-center">
            <div class="col-lg-8">
              <h1>News Details</h1>
            </div>
          </div>
        </div>
      </div>
      <nav class="breadcrumbs">
        <div class="container">
          <ol>
            <li><a href="{{url('/')}}">Home</a></li>
            <li class="current">News Details</li>
          </ol>
        </div>
      </nav>
    </div><!-- End Page Title -->

    <div class="container">
      <div class="row">

          <!-- Blog Details Section -->
          <section id="blog-details" class="blog-details section">
            <div class="container d-flex justify-content-center"> <!-- Tambahkan class flexbox -->
                <div class="card_detail">
                    <article class="article">
                        <div class="post-img">
                            <img src="{{ asset('images/news_picture/' . $news->news_picture) }}" alt="" class="img-fluid">
                        </div>
        
                        <h3 class="title">{{ $news->title }}</h3>
        
                        <div class="meta-top">
                            <ul>
                                <li class="d-flex align-items-center">
                                    <i class="bi bi-person"></i>
                                    <a href="blog-details.html"> {{ $news->authors }}</a>
                                </li>
                                <li class="d-flex align-items-center">
                                    <i class="bi bi-clock"></i>
                                    <a href="blog-details.html">
                                        <time datetime="2020-01-01">{{ $news->date }}</time>
                                    </a>
                                </li>
                            </ul>
                        </div>
        
                        <div class="content">
                            <p>{{ $news->content }}</p>
                        </div>
                    </article>
                </div>
            </div>
        </section>
        

          <!-- Blog Author Section -->

      </div>
    </div>

  </main>
@endsection