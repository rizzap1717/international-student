<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Registration extends Model
{
    use HasFactory;

    // Tentukan kolom yang dapat diisi secara massal
    protected $fillable = [
        'name', 'address', 'dob', 'faculty', 'program','country', 'phone', 'email'
    ];
    
    const STATUS_PENDING = 'pending';
    const STATUS_ACCEPTED = 'accepted';
    const STATUS_REJECTED = 'rejected';
    
}
