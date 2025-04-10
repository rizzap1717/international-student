@extends('layouts.frontend')
@section('content')
<section>
    <div class="container_pmbx">
        <h2>Form Pendaftaran Kampus</h2>
        <form action="{{ route('register.store') }}" method="POST">
            @csrf
            <div class="form-group">
                <label for="name">Nama:</label>
                <input type="text" id="name" name="name" required>
            </div>
            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
                <label for="phone">Telepon:</label>
                <input type="text" id="phone" name="phone" required>
            </div>
            <div class="form-group">
                <label for="address">Alamat:</label>
                <textarea id="address" name="address" required></textarea>
            </div>
            <div class="form-group">
                <label for="program">Program Studi:</label>
                <input type="text" id="program" name="program" required>
            </div>
            <button type="submit">Daftar</button>
        </form>
    </div>
</section>
@endsection