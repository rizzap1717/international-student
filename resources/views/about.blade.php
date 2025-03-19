@extends('layouts.frontend')
@section('content')
    <section class="about-detail ">
        <img src="{{ asset('front/assets/img/logo-removebg-preview.png') }}" alt="Mission Image" class="section-image">
        <br>
        <br>
        <h1>INTERNATIONAL STUDENTS</h1>
        <p>{{ __('messages.bio') }}</p>
    {{-- </section>
    <a href="{{ route('lang.switch', 'en') }}">English</a> |
    <a href="{{ route('lang.switch', 'id') }}">Bahasa Indonesia</a>

    <section class="values-detail"> --}}

        <h3>{{ __('messages.Title') }}</h3>
        <p>{{ __('messages.paragraph1') }}</p>
        <p>{{ __('messages.paragraph2') }}</p>
        <p>{{ __('messages.paragraph3') }}</p>
        <p>{{ __('messages.paragraph4') }}</p>
        <p>{{ __('messages.paragraph5') }}</p>
    </section>
@endsection
