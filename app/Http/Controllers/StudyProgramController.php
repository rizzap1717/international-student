<?php

namespace App\Http\Controllers;

use App\Models\StudyProgram;
use App\Models\Faculties;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class StudyProgramController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $prody = StudyProgram::all();
        $faculties = Faculties::all();

        return view('admin.study_program.index', compact('prody', 'faculties'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $prody = StudyProgram::all();
        $faculties = Faculties::all();

        return view('admin.study_program.create', compact('prody', 'faculties'));
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
            'prody_name' => 'required|string|max:255',
            'description' => 'required|string',
            'faculty_id' => 'required',
        ]);

        $prody = new StudyProgram();
        $prody->prody_name = $request->prody_name;
        $prody->description = $request->description;
        $prody->faculty_id = $request->faculty_id;
        $prody->save();

        return redirect()->route('StudyProgram.index')->with('success', 'Data has been added successfully!');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\StudyProgram  $studyProgram
     * @return \Illuminate\Http\Response
     */
    public function show(StudyProgram $studyProgram)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\StudyProgram  $studyProgram
     * @return \Illuminate\Http\Response
     */
    public function edit ($id)
    {
        $prody = StudyProgram::findOrFail($id);
        $faculties = Faculties::all();

        return view('admin.study_program.edit', compact('faculties', 'prody'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\StudyProgram  $studyProgram
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'prody_name' => 'required|string|max:255',
            'description' => 'required|string',
            'faculty_id' => 'required',
        ]);

        $prody = StudyProgram::findOrFail($id);
        $prody->prody_name = $request->prody_name;
        $prody->description = $request->description;
        $prody->faculty_id = $request->faculty_id;
        $prody->save();

        return redirect()->route('StudyProgram.index')->with('warning', 'Data has been updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\StudyProgram  $studyProgram
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $prody = StudyProgram::findOrFail($id);

        $prody->delete();

        return redirect()->route('StudyProgram.index')->with('danger', 'Data has been deleted!');
    }
}
