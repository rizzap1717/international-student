<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Achievement extends Model
{
    use HasFactory;

    protected $fillable = [
        'achievement_name',
        'achievement_picture',
    ];

    public function deleteImage(){
        if ($this->achievement_picture && file_exists(public_path('images/achievement_picture/' . $this->achievement_picture))) {
            return unlink(public_path('images/achievement_picture/' . $this->achievement_picture));
        }
    }
}
