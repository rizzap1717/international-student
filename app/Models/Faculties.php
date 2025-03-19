<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
Use Alert;

class Faculties extends Model
{
    use HasFactory;

    protected $fillable = ['faculty_name', 'description', 'picture'];
    public $timestamp = true;

    public function Lecture(){
        return $this->hasMany(Lecturer::class, 'lecture_id');
    }

    public function StudyProgram(){
        return $this->hasMany(StudyProgram::class, 'faculty_id');
    }
    protected static function boot()
    {
        parent::boot();
    
        self::deleting(function ($faculties) {
            if ($faculties->StudyProgram->count() > 0 ) {
    
                $html = 'The faculty cannot be deleted because it still has study programs : ';
                $html .= '<ul>';
                foreach ($faculties->StudyProgram as $data) {
                    $html .= "<li>$data->title</li>";
                }
                $html .= '</ul>';
                Alert::error('Error Title', 'The faculty cannot be deleted because it still has study programs');
                return false;
            }
        });
    }

}

