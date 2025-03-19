<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Lecturer;

class Structure extends Model
{
    use HasFactory;

    protected $fillable = ['structure_name', 'position', 'picture'];

    public function deleteImage(){
        if ($this->structure && file_exists(public_path('images/structure/' . $this->structure))) {
            return unlink(public_path('images/structure/' . $this->structure));
        }
    }
}
