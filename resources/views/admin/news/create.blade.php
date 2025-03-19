@extends('layouts.admin.dashboard')

@section('content')
<div class="container-xxl flex-grow-1 container-p-y">
    <h4 class="fw-bold py-3 mb-2">News</h4>
    <div class="row g-6">
        <div class="col-md-12">
            <div class="card">
                <h4 class="card-header">Form News</h4>
                <form action="{{ route('news.store') }}" method="POST" enctype="multipart/form-data">
                    @csrf
                    <div class="card-body">
                        <div class="row">
                            <div class="col-6 mb-3">
                                <label for="nameBasic" class="form-label">Title</label>
                                <input type="text" class="form-control" name="title" placeholder="please input title"
                                    required>
                            </div>
                            <div class="col-6 mb-3">
                                <label for="nameBasic" class="form-label">Date</label>
                                <input type="date" class="form-control" name="date" required>
                            </div>
                            <div class="col-6 mb-3">
                                <label for="nameBasic" class="form-label">Picture</label>
                                <input type="file" class="form-control" name="news_picture" required>
                            </div>
                            <div class="col-6 mb-3">
                                <label for="nameBasic" class="form-label">Authors</label>
                                <input type="text" class="form-control" name="authors" required placeholder="please input Author">
                            </div>
                            <div class="col-12 mb-3">
                                <label for="nameBasic" class="form-label">Content</label>
                                <textarea class="form-control" name="content" id="" cols="20" rows="5"></textarea>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <a href="{{ route('news.index') }}" type="button" class="btn btn-secondary">back</a>
                            <button type="submit" class="btn btn-primary">Save</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection
