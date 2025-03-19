<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Achievement;
use Illuminate\Http\Request;

class AchievementController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $achievement = Achievement::all();
        return view('admin.achievement.index', compact('achievement'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $achievement = Achievement::all();
        return view('admin.achievement.create', compact('achievement'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'achievement_name' => 'required',
            'achievement_picture' => 'required|image|mimes:png,jpg,jpeg|max:2048',
        ]);

        $achievement = new Achievement();
        $achievement->achievement_name = $request->achievement_name;

        if ($request->hasFile('achievement_picture')) {
            $img = $request->file('achievement_picture');
            $name = rand(1000, 9999) . $img->getClientOriginalName();
            $img->move('images/achievement_picture/', $name);
            $achievement->achievement_picture = $name;
        }

        $achievement->save();

        return redirect()->route('achievement.index')->with('success', 'Data has been added!');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Achievement  $achievement
     * @return \Illuminate\Http\Response
     */
    public function show(Achievement $achievement)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Achievement  $achievement
     * @return \Illuminate\Http\Response
     */
    public function edit(Achievement $achievement)
    {
        $achievement = Achievement::all();
        return view('achievement.edit', compact('achievement'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Achievement  $achievement
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'achievement_name' => 'required',
            'achievement_picture' => 'required|image|mimes:png,jpg,jpeg|max:2048',
        ]);

        $achievement = Achievement::findOrFail($id);
        $achievement->achievement_name = $request->achievement_name;

        if ($request->hasFile('achievement_picture')) {
            $achievement->deleteImage();
            $img = $request->file('achievement_picture');
            $name = rand(1000, 9999) . $img->getClientOriginalName();
            $img->move('images/achievement_picture/', $name);
            $achievement->achievement_picture = $name;
        }

        $achievement->save();

        return redirect()->route('achievement.index')->with('warning', 'Achievement updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Achievement  $achievement
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $achievement = Achievement::findOrFail($id);
        $achievement->deleteImage();
        $achievement->delete();

        return redirect()->route('achievement.index')->with('danger', 'Achievement deleted successfully');
    }
}
