@extends('layouts.admin.dashboard')

@section('content')
<div class="container-xxl flex-grow-1 container-p-y">
    <h4 class="fw-bold py-3 mb-4">News</h4>

    <div class="card">
        <h5 class="card-header">
            <a href="{{ route('news.create') }}" type="button" class="btn rounded-pill btn-info"
                style="float: right; padding-left: 20px; padding-right: 20px; padding-top: 7px; padding-bottom: 7px">
                <i class="bi bi-person-fill-add" data-bs-toggle="tooltip" data-bs-offset="0,4" data-bs-placement="left"
                    data-bs-html="true" title="Add cuti"></i>
                Add News
            </a>
            Table of News
        </h5>

        <div class="table-responsive text-nowrap">
            <table class="table table-hover" id="example">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Title</th>
                        <th>Image</th>
                        <th>Content</th>
                        <th>Date</th>
                        <th>Authors</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody class="table-border-bottom-0">
                    @foreach ($news as $index => $data)
                    <tr>
                        <td>{{ $index + 1 }}</td>
                        <td>{{ $data->title }}</td>
                        <td>
                            <img src="{{ asset('images/news_picture/' . $data->news_picture) }}" width="70"
                                alt="{{ $data->title }}">
                        </td>
                        <td>{{ Str::limit($data->content, 30, '...') }}</td>
                        <td>{{ \Carbon\Carbon::parse($data->date)->translatedFormat('d F Y') }}</td>
                        <td>{{ $data->authors }}</td>
                        <td>
                            <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                <i class="bx bx-dots-vertical-rounded"></i>
                            </button>
                            <ul class="dropdown-menu">
                                <li>
                                    <a href="{{ route('news.edit', $data->id) }} }}" class="dropdown-item">
                                        <i class="bx bx-edit-alt me-1"></i> Edit
                                    </a>
                                </li>
                                <li>
                                    <form id="delete-form-{{ $data->id }}"
                                        action="{{ route('news.destroy', $data->id) }}" method="POST"
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

{{-- Update Modal --}}
{{-- @foreach ($news as $data)
<div class="modal fade" id="updateModal{{ $data->id }}" tabindex="-1" aria-labelledby="updateModalLabel"
    aria-hidden="true" data-bs-backdrop="static">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Update News</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form action="{{ route('news.update', $data->id) }}" method="POST" enctype="multipart/form-data">
                @csrf
                @method('PUT')
                <div class="modal-body">
                    <div class="row">
                        <div class="col-6 mb-3">
                            <label for="nameBasic" class="form-label">Title</label>
                            <input type="text" class="form-control" name="title"
                                value="{{ old('title', $data->title) }}" required>
                        </div>
                        <div class="col-6 mb-3">
                            <label for="nameBasic" class="form-label">Date</label>
                            <input type="date" class="form-control" name="date" value="{{ old('date', $data->date) }}"
                                required>
                        </div>
                        <div class="col-12 mb-3">
                            <label for="nameBasic" class="form-label">Content</label>
                            <textarea class="form-control" name="content" id="" cols="20"
                                rows="3">{{ old('title', $data->title) }}</textarea>
                        </div>
                        <div class="col-12 mb-3">
                            <label for="nameBasic" class="form-label">Picture</label>
                            @if($data->news_picture)
                            <p><img src="{{ asset('images/news_picture/' . $data->news_picture) }}" alt="news_picture"
                                    width="400px">
                            </p>
                            @endif
                            <input type="file" class="form-control" name="news_picture" required>
                        </div>
                        <div class="col-12 mb-3">
                            <label for="nameBasic" class="form-label">Select Activity</label>
                            <select class="form-select" name="activity_id" id="">
                                @foreach ($activity as $data)
                                <option value="{{ $data->id }}">{{ $data->activity_name }}</option>
                                @endforeach
                            </select>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
@endforeach --}}
{{-- Show Modal --}}
{{-- @foreach ($activity as $data) --}}
{{-- <div class="modal fade" id="showModal{{ $data->id }}" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
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
</div> --}}
{{-- @endforeach --}}
@endsection
@push('scripts')
<script src="https://code.jquery.com/jquery-3.7.1.js"></script>
<script src="https://cdn.datatables.net/2.1.8/js/dataTables.js"></script>
<script src="https://cdn.datatables.net/2.1.8/js/dataTables.bootstrap5.js"></script>

<script>
    new DataTable('#example')
</script>
@endpush
