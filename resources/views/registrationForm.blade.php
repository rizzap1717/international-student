@extends('layouts.frontend')
@section('content')

<section>
  <div class="container_registration">
    <h2>Form Pendaftaran Mahasiswa</h2>
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
        <input type="date" id="birth_date" name="birth_date" required>
      </div>

      <div class="form-group">
        <label for="faculty">Faculty :</label>
        <select id="faculty" name="faculty" required>
          <option value="">Select Faculty</option>
          <option value="IT and Computer">IT and Computer</option>
          <option value="Health">Health</option>
          <option value="Economics and Business">Economics and Business</option>
        </select>
      </div>

      <div class="form-group">
        <label for="study_program">Study Program :</label>
        <select id="study_program" name="study_program" required>
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
      

      <button type="submit"><a href="{{url('emails/registration')}}">Register</a></button>
    </form>
  </div>
</section>

@endsection
