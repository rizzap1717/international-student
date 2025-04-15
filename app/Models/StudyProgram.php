<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Faculties;


class StudyProgram extends Model
{
    use HasFactory;

    protected $fillable = ['prody_name', 'description', 'faculty_id'];
    public $timestamp = true;

    public function Faculties(){
        return $this->belongsTo(Faculties::class, 'faculty_id');
    }

}
