<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Accreditation;
use Illuminate\Http\Request;




class AccreditationController extends Controller
{
    public function index()
    {
        // $accreditation = Accreditation::all();
        $accreditation = Accreditation::all(); // Instance model tunggal
        return view('admin.accreditation.index', compact('accreditation'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $accreditation = Accreditation::all();
        return view('admin.accreditation.upload');
    }

    public function store(Request $request)
{
    $request->validate([
        'accreditation_name' => 'required',
        'accreditation_picture' => 'required|image|mimes:png,jpg,jpeg|max:2048',
    ]);

    $accreditation = new Accreditation();

    if ($request->hasFile('accreditation_picture')) {
        $img = $request->file('accreditation_picture');
        $name = rand(1000, 9999) . $img->getClientOriginalName();
        $img->move('images/accreditation_picture/', $name);
        $accreditation->accreditation_picture = $name;
    }

    $accreditation->accreditation_name = $request->accreditation_name;
    $accreditation->save();

    // Redirect ke halaman accreditation.index dengan pesan sukses
    return redirect()->route('accreditation.index')->with('success', 'Data has been added!');
}



    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Accreditation  $accreditation
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $accreditation = Accreditation::findOrFail($id);
        return view('accreditation.show', compact('accreditation'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Accreditation  $accreditation
     * @return \Illuminate\Http\Response
     */
    public function edit(Accreditation $accreditation)
    {
        $accreditation = Accreditation::all();
        return view('accreditation.edit', compact('accreditation'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Accreditation  $accreditation
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {

    $request->validate([
        'accreditation_name' => 'required',
        'accreditation_picture' => 'required|image|mimes:png,jpg,jpeg|max:2048',
    ]);

    $accreditation = Accreditation::findOrFail($id);

    if ($request->hasFile('accreditation_picture')) {
        $accreditation->deleteImage();
        $img = $request->file('accreditation_picture');
        $name = rand(1000, 9999) . $img->getClientOriginalName();
        $img->move('images/accreditation_picture/', $name);
        $accreditation->accreditation_picture = $name;
    }

    $accreditation->accreditation_name = $request->accreditation_name;
    $accreditation->save();

    // Redirect ke halaman accreditation.index dengan pesan sukses
    return redirect()->route('accreditation.index')->with('warning', 'Data has been updated!');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Accreditation  $accreditation
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $accreditation = Accreditation::findOrFail($id);
        $accreditation->delete();

        return redirect()->route('accreditation.index')->with('danger', 'Data has been deleted!');
    }
}
