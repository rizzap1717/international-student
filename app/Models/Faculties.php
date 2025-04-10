<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Faculties extends Model
{
    use HasFactory;

    protected $fillable = ['faculty_name', 'description', 'picture'];
    public $timestamps = true; // Perbaikan dari 'timestamp' ke 'timestamps'

    public function studyPrograms(): HasMany
    {
        return $this->hasMany(StudyProgram::class, 'faculty_id');
    }

    protected static function boot()
{
    parent::boot();

    static::deleting(function ($faculty) {
        if ($faculty->studyPrograms()->count() > 0) {
            return false; // Stop proses delete
        }
    });
}
}
