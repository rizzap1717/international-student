<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'content',
        'news_picture',
        'date',
        'authors',
    ];


    public function deleteImage(){
        if ($this->news_picture && file_exists(public_path('images/news_picture/' . $this->news_picture))) {
            return unlink(public_path('images/news_picture/' . $this->news_picture));
        }
    }
}
