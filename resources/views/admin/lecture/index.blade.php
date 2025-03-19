@extends('layouts.admin.dashboard')

@section('content')
<div class="container-xxl flex-grow-1 container-p-y">
    <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">Academic /</span> Lecture</h4>

    <div class="card">
        <h5 class="card-header">
            <button type="button" class="btn rounded-pill btn-info" data-bs-toggle="modal" data-bs-target="#createModal"
                style="float: right; padding-left: 20px; padding-right: 20px; padding-top: 7px; padding-bottom: 7px">
                <i class="bi bi-person-fill-add" data-bs-toggle="tooltip" data-bs-offset="0,4" data-bs-placement="left"
                    data-bs-html="true" title="Add cuti"></i>
                Add Lecture
            </button>
            Table of Lecturer
        </h5>

        <!-- Table for cuti Data -->
        <div class="table-responsive text-nowrap">
            <table class="table table-hover" id="example">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Lecture Name</th>
                        <th>Faculties</th>
                        <th>Study Program</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody class="table-border-bottom-0">
                    @foreach ($lecture as $data)
                    <tr>
                        <td>{{ $loop->index + 1 }}</td>
                        <td>{{ $data->lecture_name }}</td>
                        <td>{{ $data->faculties->faculty_name }}</td>
                        <td>{{ $data->prody_name }}</td>
                        <td>
                            <div class="dropdown">
                                <button type="button" class="btn p-0 dropdown-toggle hide-arrow"
                                    data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="bx bx-dots-vertical-rounded"></i>
                                </button>
                                <ul class="dropdown-menu">
                                    <li>
                                        <button class="dropdown-item" data-bs-toggle="modal"
                                            data-bs-target="#updateModal{{ $data->id }}">
                                            <i class="bx bx-edit-alt me-1"></i> Edit
                                        </button>
                                    </li>
                                    <li>
                                        <form id="delete-form-{{ $data->id }}"
                                            action="{{ route('lecture.destroy', $data->id) }}" method="POST"
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
                            </div>
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
                <h5 class="modal-title">Add Lecture</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form action="{{ route('lecture.store') }}" method="POST">
                @csrf
                <div class="modal-body">
                    <div class="row">
                        <div class="col-12 mb-3">
                            <label for="nameBasic" class="form-label">Lecture Name</label>
                            <input type="text" class="form-control" name="lecture_name" placeholder="please input name"
                                required>
                        </div>
                        <div class="col-12 mb-3">
                            <label class="form-label" for="faculties">Faculties:</label>
                            <select name="faculty_id" class="form-select" id="faculties" onchange="updatePrody()">
                                <option value="">Select Faculties</option>
                                <option value="1">IT And Computers</option>
                                <option value="2">Helth</option>
                                <option value="3">Economics And Business</option>
                            </select>
                        </div>
                        <div class="col-12 mb-3">
                            <label class="form-label" for="prody">Study Program</label>
                            <select name="prody_name" class="form-select" id="prody">
                                <option value="">Select Study Program</option>
                            </select>
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
@foreach ($lecture as $data)
<div class="modal fade" id="updateModal{{ $data->id }}" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Update Lecture</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            @foreach ($lecture as $data)
            <form action="{{ route('lecture.update', $data->id) }}" method="POST">
                @csrf
                @method('PUT')
                <div class="modal-body">
                    <div class="row">
                        <div class="col-12 mb-3">
                            <label for="nameBasic" class="form-label">Lecture Name</label>
                            <input type="text" class="form-control" name="lecture_name" placeholder="please input name"
                            value="{{ old('lecture_name', $data->lecture_name) }}" required>
                        </div>
                        <div class="col-12 mb-3">
                            <label for="nameBasic" class="form-label">Lecture Name</label>
                            <select class="form-select" name="faculty_id" required>
                                @foreach ($faculties as $data)
                                <option value="{{ $data->id }}">{{ $data->faculty_name }}</option>
                                @endforeach
                            </select>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-primary">Save</button>
                    </div>
                </div>
            </form>
            @endforeach
        </div>
    </div>
</div>
@endforeach
<script>
    // Menggunakan angka sebagai kunci di objek
        const prodyData = {
            1: ["MIF D3", "TIK D3", "PME D4", "MIF D4"],
            2: ["AKS D3", "FAR D3", "FIS D3", "MPRS D3", "RMIK D3", "HIM D4"],
            3: ["AKE D3", "KAT D4", "BDI D4"]
        };

        function updatePrody() {
    const faculties = document.getElementById("faculties").value;
    const prodySelect = document.getElementById("prody");

    // Reset Study Program dropdown
    prodySelect.innerHTML = "<option value=''>Select Study Program</option>";

    if (faculties && prodyData[faculties]) {
        prodyData[faculties].forEach(prody => {
            const option = document.createElement("option");
            option.value = prody; // Menggunakan nama program studi asli sebagai value
            option.textContent = prody;
            prodySelect.appendChild(option);
        });
    } else {
        const option = document.createElement("option");
        option.textContent = "No study programs available";
        prodySelect.appendChild(option);
    }
}

</script>
@endsection
@push('scripts')
<script src="https://code.jquery.com/jquery-3.7.1.js"></script>
<script src="https://cdn.datatables.net/2.1.8/js/dataTables.js"></script>
<script src="https://cdn.datatables.net/2.1.8/js/dataTables.bootstrap5.js"></script>

<script>
    new DataTable('#example')
</script>
@endpush
