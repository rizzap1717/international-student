<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Accreditation extends Model
{
    use HasFactory;

    protected $fillable = [
        'accreditation_name',
        'accreditation_picture',
    ];

    public function deleteImage(){
        if ($this->accreditation_picture && file_exists(public_path('images/accreditation_picture/' . $this->accreditation_picture))) {
            return unlink(public_path('images/accreditation_picture/' . $this->accreditation_picture));
        }
    }
}
