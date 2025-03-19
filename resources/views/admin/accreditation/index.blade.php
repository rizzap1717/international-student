@extends('layouts.admin.dashboard')

@section('content')
<div class="container-xxl flex-grow-1 container-p-y">
    <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">Academic /</span> Accreditation</h4>

    <div class="card">
        <h5 class="card-header">
            <button type="button" class="btn rounded-pill btn-info" data-bs-toggle="modal" data-bs-target="#createModal"
                style="float: right; padding-left: 20px; padding-right: 20px; padding-top: 7px; padding-bottom: 7px">
                <i class="bi bi-person-fill-add" data-bs-toggle="tooltip" data-bs-offset="0,4" data-bs-placement="left"
                    data-bs-html="true" title="Add cuti"></i>
                Add Accreditation
            </button>
            Table of Accreditation
        </h5>

        <!-- Table for cuti Data -->
        <div class="table-responsive text-nowrap">
            <table class="table table-hover" id="example">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Accreditations</th>
                        <th>Picture</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody class="table-border-bottom-0">
                    @foreach ($accreditation as $data)
                    <tr>
                        <td>{{ $loop->iteration }}</td>
                        <td>
                            {{ $data->accreditation_name }}
                        </td>
                        <td>
                            <img src="{{ asset('images/accreditation_picture/'.$data->accreditation_picture) }}"
                                width="60" alt="File">
                        </td>
                        <td>
                            <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                <i class="bx bx-dots-vertical-rounded"></i>
                            </button>
                            <ul class="dropdown-menu">
                                <li>
                                    <button class="dropdown-item" data-bs-toggle="modal" data-bs-target="#updateModal{{ $data->id }}">
                                        <i class="bx bx-edit-alt me-1"></i> Edit
                                    </button>
                                </li>
                                <li>
                                    <form id="delete-form-{{ $data->id }}"
                                        action="{{ route('accreditation.destroy', $data->id) }}" method="POST"
                                        style="display: none;">
                                        @csrf
                                        @method('DELETE')
                                    </form>
                                    <button type="button" onclick="confirmDelete({{ $data->id }})"
                                        class="dropdown-item">
                                        <i class="bx bx-trash me-1"></i> Delete
                                    </button>
                                </li>
                            </ul>
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
</div>
{{-- Create Modal --}}
<div class="modal fade" id="createModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Add Accreditation</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form action="{{ route('accreditation.store') }}" method="POST" enctype="multipart/form-data">
                    @csrf
                    <div class="row">
                        <div class="col-12 mb-3">
                            <label for="name" class="form-label">Accreditation Name</label>
                            <input type="text" name="accreditation_name" class="form-control"
                                placeholder="Enter accreditation name" required>
                        </div>

                        <div class="col-12 mb-3">
                            <label for="file" class="form-label">Upload File</label>
                            <input type="file" name="accreditation_picture" class="form-control" required>
                        </div>

                        <!-- Tombol Submit -->
                        <div class="col-12 text-end">
                            <button type="submit" class="btn btn-primary">Upload</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
{{-- Update Modal --}}
@foreach ($accreditation as $data)
<div class="modal fade" id="updateModal{{ $data->id }}" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Update Accreditation</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form action="{{ route('accreditation.update', $data->id) }}" method="POST"
                    enctype="multipart/form-data">
                    @csrf
                    @method('PUT')
                    <div class="row">
                        <div class="col-12 mb-3">
                            <label for="name" class="form-label">Accreditation Name</label>
                            <input type="text" name="accreditation_name" class="form-control"
                                value="{{ old('accreditation_name', $data->accreditation_name) }}" required>
                        </div>

                        <div class="col-12 mb-3">
                            <label for="file" class="form-label">Upload File</label>
                            <div class="mb-3 ">
                                <img src="{{ asset('images/accreditation_picture/'.$data->accreditation_picture) }}"
                                    width="100px" alt="">
                            </div>
                            <input type="file" name="accreditation_picture" class="form-control" required>
                        </div>

                        <!-- Tombol Submit -->
                        <div class="col-12 text-end">
                            <button type="submit" class="btn btn-primary">Upload</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
@endforeach
@endsection
@push('scripts')
<script src="https://code.jquery.com/jquery-3.7.1.js"></script>
<script src="https://cdn.datatables.net/2.1.8/js/dataTables.js"></script>
<script src="https://cdn.datatables.net/2.1.8/js/dataTables.bootstrap5.js"></script>

<script>
    new DataTable('#example')
</script>
@endpush
