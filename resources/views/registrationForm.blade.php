@extends('layouts.frontend')
@section('content')

<section>
  <div class="container_registration">
    <h2>Register Here</h2>
    <form action="{{ route('register.store') }}" method="POST">
      @csrf
      <div class="form-group">
        <label for="name">Full Name :</label>
        <input type="text" id="name" name="name" required>
      </div>

      <div class="form-group">
        <label for="address">Address :</label>
        <textarea id="address" name="address" required></textarea>
      </div>

      <div class="form-group">
        <label for="birth_date">Date of birth :</label>
        <input type="date" id="birth_date" name="dob" required>
      </div>

      <div class="form-group">
        <label for="faculty">Faculty :</label>
        <select id="faculty" name="faculty" class="form-control" required>
            <option value="">Select Faculty</option>
            @foreach ($faculties as $item)
                <option value="{{$item->id}}">{{$item->faculty_name}}</option>
            @endforeach
        </select>
    </div>
    
    <div class="form-group">
        <label for="study_program">Study Program :</label>
        <select id="study_program" name="study_program" class="form-control" required>
            <option value="">Select Study Program</option>
        </select>
    </div>     

      <div class="form-group">
        <label for="country">country :</label>
        <input type="text" id="country" name="country" required>
      </div>

      <div class="form-group">
        <label for="phone">Phone :</label>
        <input type="tel" id="phone" name="phone" placeholder="+62xxxxxxxxxxx" pattern="^\+62\d{9,13}$" required>
        <small>Please enter your number correctly</small>
      </div>

      <div class="form-group">
        <label for="email">Email :</label>
        <input type="email" id="email" name="email" required>
      </div>
      
      

      <button type="submit">Register</button>
    </form>
    @if ($errors->any())
    <div class="alert alert-danger">
        <ul>
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li> {{-- bukan validation.required --}}
            @endforeach
        </ul>
    </div>
@endif

  </div>
</section>

@endsection
