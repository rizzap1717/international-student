@extends('layouts.frontend')
@section('content')
<h1>Terima Kasih atas Pendaftaran Anda!</h1>
<p>Nama: {{ $data['name'] }}</p>
<p>Alamat: {{ $data['address'] }}</p>
<p>Tanggal Lahir: {{ $data['dob'] }}</p>
<p>Fakultas: {{ $data['faculty'] }}</p>
<p>Program Studi: {{ $data['program'] }}</p>
<p>Nomor Telepon: {{ $data['phone'] }}</p>
<p>Negara: {{ $data['country'] }}</p>

@endsection