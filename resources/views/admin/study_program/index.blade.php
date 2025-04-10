@extends('layouts.admin.dashboard')

@use Illuminate\Support\Str;
@section('content')
<div class="container-xxl flex-grow-1 container-p-y">
    <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">Academic /</span> Study Program</h4>

    <div class="card">
        <h5 class="card-header">
            <button type="button" class="btn rounded-pill btn-info" data-bs-toggle="modal" data-bs-target="#createModal"
                style="float: right; padding-left: 20px; padding-right: 20px; padding-top: 7px; padding-bottom: 7px">
                <i class="bi bi-person-fill-add" data-bs-toggle="tooltip" data-bs-offset="0,4" data-bs-placement="left"
                    data-bs-html="true" title="Add cuti"></i>
                Add Study Program
            </button>
            Table of Study Program
        </h5>

        <!-- Table for cuti Data -->
        <div class="table-responsive text-nowrap">
            <table class="table table-hover" id="example">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Study Program</th>
                        <th>Description</th>
                        <th>Faculties</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody class="table-border-bottom-0">
                    @foreach ($prody as $data)
                    <tr>
                        <td>{{ $loop->index + 1 }}</td>
                        <td>
                            <a href="" data-bs-toggle="modal" data-bs-target="#showModal{{ $data->id }}">{{
                                $data->prody_name }}</a>
                        </td>
                        <td>{{ Str::limit($data->description, 30, '...') }}</td>
                        <td>{{ $data->faculties->faculty_name }}</td>
                        <td>
                            <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                <i class="bx bx-dots-vertical-rounded"></i>
                            </button>
                            <ul class="dropdown-menu">
                                <li>
                                    <button class="dropdown-item" data-bs-toggle="modal"
                                        data-bs-target="#updateModal{{$data->id}}">
                                        <i class="bx bx-edit-alt me-1"></i> Edit
                                    </button>
                                </li>
                                <li>
                                    <form id="delete-form-{{ $data->id }}" action="{{ route('study_program.destroy', $data->id) }}" method="POST" style="display: none;">
                                        @csrf
                                        @method('DELETE')
                                    </form>
                                    <button type="button" onclick="confirmDelete({{ $data->id }})" class="dropdown-item">
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
                <h5 class="modal-title">Add Study Program</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form action="{{ route('study_program.store') }}" method="POST">
                @csrf
                <div class="modal-body">
                    <div class="row">
                        <div class="col-12 mb-3">
                            <label for="nameBasic" class="form-label">Study Name</label>
                            <input type="text" class="form-control" name="prody_name" placeholder="please input name"
                                required>
                        </div>
                        <div class="col-12 mb-3">
                            <label for="nameBasic" class="form-label">Faculties Name</label>
                            <select class="form-select" name="faculty_id" required>
                                <option selected disabled value="" selected disabled>Select Faculties</option>
                                @foreach ($faculties as $data)
                                <option value="{{ $data->id }}">{{ $data->faculty_name }}</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="col-12 mb-3">
                            <label for="nameBasic" class="form-label">Description</label>
                            <textarea class="form-control" name="description" id="" cols="20" rows="5"></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-primary">Save</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
{{-- Update Modal --}}
@foreach ($prody as $data)
<div class="modal fade" id="updateModal{{ $data->id }}" tabindex="-1" aria-labelledby="updateModalLabel"
    aria-hidden="true" data-bs-backdrop="static">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Update Study Program</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form action="{{ route('study_program.update', $data->id) }}" method="POST">
                @csrf
                @method('PUT')
                <div class="modal-body">
                    <div class="row">
                        <div class="col-12 mb-0">
                            <label for="nameBasic" class="form-label">Study Name</label>
                            <input type="text" class="form-control" name="prody_name" placeholder="please input name"
                                value="{{ old('prody_name', $data->prody_name) }}" required>
                        </div>
                        <div class="col-12 mb-0">
                            <label for="nameBasic" class="form-label">Faculties Name</label>
                            <select class="form-select" name="faculty_id" required>
                                @foreach ($faculties as $data)
                                <option value="{{ $data->id }}">{{ $data->faculty_name }}</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="col-12 mb-0">
                            <label for="nameBasic" class="form-label">Description</label>
                            <textarea class="form-control" name="description" id="{{ $data->id }}" cols="20"
                                rows="5"></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-primary">Save</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
@endforeach
{{-- Show Modal --}}
@foreach ($prody as $data)
<div class="modal fade" id="showModal{{ $data->id }}" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Detail Study</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-12 mb-3">
                        <span>
                            <p>Study Name :
                            <h4>{{ $data->prody_name }}</h4>
                            </p>
                        </span>
                    </div>
                    <div class="col-12 mb-3">
                        <span>
                            <p>Faculties :
                            <h4>{{ $data->faculties->faculty_name }}</h4>
                            </p>
                        </span>
                    </div>
                    <div class="col-12 mb-3">
                        <span>
                            <p>Description :
                            <h4>{{ $data->description }}</h4>
                            </p>
                        </span>
                    </div>
                </div>
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