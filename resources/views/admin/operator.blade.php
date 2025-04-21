@extends('layouts.admin.dashboard') {{-- Sesuaikan dengan layout admin kamu --}}

@section('content')
    <div class="container mt-4">
        <h2>Data Pendaftaran Mahasiswa (Pending)</h2>

        @if (session('success'))
            <div class="alert alert-success">{{ session('success') }}</div>
        @endif

        <table class="table table-bordered mt-3">
            <thead>
                <tr>
                    <th>Nama</th>
                    <th>Alamat</th>
                    <th>Tgl Lahir</th>
                    <th>Fakultas</th>
                    <th>Program Studi</th>
                    <th>Negara</th>
                    <th>No HP</th>
                    <th>Email</th>
                </tr>
            </thead>
            <tbody>
                @forelse($pendaftarans as $data)
                    @php
                        $faculty = \DB::table('faculties')->where('id', $data->faculty)->value('faculty_name');
                        $program = \App\Models\StudyProgram::where('id', $data->program)->value('prody_name');
                    @endphp
                    <tr>
                        <td>{{ $data->name }}</td>
                        <td>{{ $data->address }}</td>
                        <td>{{ $data->dob }}</td>
                        <td>{{ $faculty }}</td>
                        <td>{{ $program }}</td>
                        <td>{{ $data->country }}</td>
                        <td>{{ $data->phone }}</td>
                        <td>{{ $data->email }}</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="9" class="text-center">Belum ada pendaftaran.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
        <div class="d-flex justify-content-center">
            {{ $pendaftarans->links('pagination::bootstrap-4') }}
        </div>
        
    </div>
@endsection
