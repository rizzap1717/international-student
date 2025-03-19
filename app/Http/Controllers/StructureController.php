<?php

namespace App\Http\Controllers;

use App\Models\Structure;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class StructureController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $structure = Structure::all();

        return view('admin.structure.index', compact('structure'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $structure = Structure::all();

        return view('admin.structure.create', compact('structure'));
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
            'structure_name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'picture' => 'nullable|mimes:jpeg,png,jpg|max:2048',

        ]);

        $structure = new Structure();
        $structure->structure_name = $request->structure_name;
        $structure->position = $request->position;

        if ($request->hasFile('picture')) {
            $img = $request->file('picture');
            $name = rand(1000, 9999) . $img->getClientOriginalName();
            $img->move('images/structure/', $name);
            $structure->picture = $name;
        }

        $structure->save();

        return redirect()->route('structure.index')->with('success', 'Data has been added successfully!');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Structure  $structure
     * @return \Illuminate\Http\Response
     */
    public function show(Structure $structure)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Structure  $structure
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $structure = Structure::findOrFail($id);

        return view('admin.structure.edit', compact('structure'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Structure  $structure
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'structure_name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'picture' => 'nullable|mimes:jpeg,png,jpg|max:2048',
        ]);

        $structure = Structure::findOrFail($id);
        $structure->structure_name = $request->structure_name;
        $structure->position = $request->position;

        if ($request->hasFile('picture')) {
            $structure->deleteImage();
            $img = $request->file('picture');
            $name = rand(1000, 9999) . $img->getClientOriginalName();
            $img->move('images/structure/', $name);
            $structure->picture = $name;
        }

        $structure->save();

        return redirect()->route('structure.index')->with('warning', 'Data has been updated successfully!');

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Structure  $structure
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $structure = Structure::findOrFail($id);

        $structure->delete();

        return redirect()->route('structure.index')->with('danger', 'Data has been deleted!');
    }
}
