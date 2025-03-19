<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Profil;

class ProfilController extends Controller
{
    public function index()
    {
        $profil = Profil::all();
        return view('admin.profil.index', compact('profil'));
    }

    /**                                                                                                                                                                                                                                     
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $profil = Profil::all();
        return view('admin.profil.index', compact('profil'));
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
            'vission' => 'required',
            'mission' => 'required'
        ]);

        $profil = new Profil();
        $profil->vission = $request->vission;
        $profil->mission = $request->mission;
        $profil->save();

        return redirect()->route('profile.index')->with('success', 'Data has been added successfully');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Profil  $profil
     * @return \Illuminate\Http\Response
     */
    public function show(Profil $profil)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Profil  $profil
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $profil = Profil::findOrFail($id);
        return view('admin.profil.edit', compact('profil'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Profil  $profil
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'vission' => 'required',
            'mission' => 'required',
        ]);

        $profil = Profil::findOrFail($id);
        $profil->vission = $request->vission;
        $profil->mission = $request->mission;
        $profil->save();

        return redirect()->route('profile.index')->with('warning', 'Data has been updated successfully');

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Profil  $profil
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $profil = Profil::findOrFail($id);
        $profil->delete();
        return redirect()->route('profile.index')->with('danger', 'Data has been deleted successfully');
    }
}
