<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
{
    // Admin
    User::updateOrCreate(
        ['email' => 'admin@gmail.com'],
        [
            'name' => 'Admin',
            'password' => Hash::make('12345678'),
            'role' => 'admin',
        ]
    );

    // Operator
    User::updateOrCreate(
        ['email' => 'operator@gmail.com'],
        [
            'name' => 'Operator',
            'password' => Hash::make('12345678'),
            'role' => 'operator',
        ]
    );
}
}
