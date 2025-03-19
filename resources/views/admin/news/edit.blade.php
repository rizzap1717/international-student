@extends('layouts.admin.dashboard')

@section('content')
<div class="container-xxl flex-grow-1 container-p-y">
    <h4 class="fw-bold py-3 mb-2">News</h4>
    <div class="row g-6">
        <div class="col-md-12">
            <div class="card">
                <h4 class="card-header">Form News</h4>
                <form action="{{ route('news.update', $news->id) }}" method="POST" enctype="multipart/form-data">
                    @csrf
                    @method('PUT')
                    <div class="modal-body">
                        <div class="row">
                            <div class="row">
                                <div class="col-6 mb-3">
                                    <label for="nameBasic" class="form-label">Title</label>
                                    <input type="text" class="form-control" name="title"
                                        value="{{ old('title', $news->title) }}" required>
                                </div>
                                <div class="col-6 mb-3">
                                    <label for="nameBasic" class="form-label">Date</label>
                                    <input type="date" class="form-control" name="date"
                                        value="{{ old('date', $news->date) }}" required>
                                </div>
                                <div class="col-6 mb-3">
                                    <label for="nameBasic" class="form-label">Picture</label>
                                    <div class="input-group">
                                        <input type="file" class="form-control" name="news_picture" required/>
                                        <a href="javascript:void(0)" type="button" class="btn btn-outline-secondary"
                                            data-bs-toggle="modal" data-bs-target="#showModal{{ $news->id }}">View</a>
                                    </div>
                                </div>
                                <div class="col-6 mb-3">
                                    <label for="nameBasic" class="form-label">Authors</label>
                                    <input type="text" class="form-control" name="authors" required
                                        value="{{ old('authors', $news->authors) }}">
                                </div>
                                <div class="col-12 mb-3">
                                    <label for="nameBasic" class="form-label">Content</label>
                                    <textarea class="form-control" name="content" cols="20" rows="5">{{ $news->content }}
                                        </textarea>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <a href="{{ route('news.index') }}" type="button" class="btn btn-secondary">back</a>
                                <button type="submit" class="btn btn-primary">Save</button>
                            </div>
                        </div>
                    </div>
            </div>
            </form>
        </div>
    </div>
</div>
</div>
{{-- Update Modal --}}
<div class="modal fade" id="showModal{{ $news->id }}" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Image News</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="card-body">
                <img src="{{ asset('images/news_picture/'. $news->news_picture) }}" width="200px" height="200px" alt="">
            </div>
        </div>
    </div>
</div>
@endsection
