<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Operator;

class OperatorSeeder extends Seeder
{
    public function run(): void
    {
        Operator::firstOrCreate(
            ['email' => 'operator@example.com'],
            [
                'name' => 'Operator',
                'password' => Hash::make('12345678'),
            ]
        );
    }
}
