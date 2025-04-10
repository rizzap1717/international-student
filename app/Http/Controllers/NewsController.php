<?php

namespace App\Http\Controllers;

use App\Models\News;
use App\Models\Activity;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Carbon\Carbon;

class NewsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
{
    $news = News::all(); // Ambil semua data news

    return view('admin.news.index', compact('news'));
}

public function indexapi()
    {
        $news = News::all();
        $res = [
            'success' => true,
            'message' => 'Daftar Berita',
            'news' => $news,
        ];
        return response()->json($res,200);
   }
    
    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $news = News::all();

        return view('admin.news.create', compact('news'));
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
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'news_picture' => 'required|mimes:jpeg,png,jpg|max:2048',
            'date' => 'required',
            'authors' => 'required',
        ]);

        $news = new News();
        $news->title = $request->title;
        $news->content = $request->content;

        if ($request->hasFile('news_picture')) {
            $img = $request->file('news_picture');
            $name = rand(1000, 9999) . $img->getClientOriginalName();
            $img->move('images/news_picture/', $name);
            $news->news_picture = $name;
        }

        $news->date = $request->date;
        $news->authors = $request->authors;
        $news->save();

        return redirect()->route('news.index')->with('success', 'Data has been added successfully!');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\News  $news
     * @return \Illuminate\Http\Response
     */
    public function show(News $news)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\News  $news
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $news = News::findOrFail($id);

        return view('admin.news.edit', compact('news'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\News  $news
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'news_picture' => 'required|mimes:jpeg,png,jpg|max:2048',
            'date' => 'required',
            'authors' => 'required',
        ]);

        $news = News::findOrFail($id);
        $news->title = $request->title;
        $news->content = $request->content;

        if ($request->hasFile('news_picture')) {
            $news->deleteImage();
            $img = $request->file('news_picture');
            $name = rand(1000, 9999) . $img->getClientOriginalName();
            $img->move('images/news_picture/', $name);
            $news->news_picture = $name;
        }

        $news->date = $request->date;
        $news->authors = $request->authors;
        $news->save();

        return redirect()->route('news.index')->with('warning', 'Data has been updated successfully!');
    }
    

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\News  $news
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $news = News::findOrFail($id);

        $news->deleteImage();
        $news->delete();

        return redirect()->route('news.index')->with('danger', 'Data has been deleted!');
    }
}
