<?php

namespace Database\Seeders;

use App\Models\Faculties;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FacultiesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Faculties::create([
            'faculty_name' => 'IT And Computers',
            'description' => '',
        ]);
        Faculties::create([
            'faculty_name' => 'Helth',
            'description' => '',
        ]);
        Faculties::create([
            'faculty_name' => 'Economics And Business',
            'description' => '',
        ]);
    }
}
