<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Article;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ArticleController extends Controller
{
    public function index(Request $request)
    {
        $query = Article::query();
        
        // If not admin/authenticated, only show published articles
        if (!auth("sanctum")->check()) {
            $query->where("is_published", true);
        }

        if ($request->has("category") && $request->category !== "Semua") {
            $query->where("category", $request->category);
        }

        return response()->json($query->latest()->get());
    }

    public function show($slug)
    {
        $query = Article::where("slug", $slug);
        
        if (!auth("sanctum")->check()) {
            $query->where("is_published", true);
        }

        $article = $query->firstOrFail();
        return response()->json($article);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            "title" => "required|string|max:255",
            "content" => "required|string",
            "category" => "required|string",
            "thumbnail" => "nullable|image|max:2048",
            "is_published" => "boolean"
        ]);

        $article = new Article();
        $article->title = $validated["title"];
        $article->slug = Str::slug($validated["title"]) . "-" . time();
        $article->content = $validated["content"];
        $article->category = $validated["category"];
        $article->is_published = $request->boolean("is_published", false);
        $article->user_id = auth()->id();
        
        if ($article->is_published) {
            $article->published_at = now();
        }

        if ($request->hasFile("thumbnail")) {
            $path = $request->file("thumbnail")->store("articles", "public");
            $article->thumbnail_path = "/storage/" . $path;
        }

        $article->save();

        return response()->json($article, 201);
    }

    public function update(Request $request, $id)
    {
        $article = Article::findOrFail($id);
        
        $validated = $request->validate([
            "title" => "sometimes|required|string|max:255",
            "content" => "sometimes|required|string",
            "category" => "sometimes|required|string",
            "thumbnail" => "nullable|image|max:2048",
            "is_published" => "boolean"
        ]);

        if (isset($validated["title"])) {
            $article->title = $validated["title"];
            $article->slug = Str::slug($validated["title"]) . "-" . time();
        }
        
        if (isset($validated["content"])) $article->content = $validated["content"];
        if (isset($validated["category"])) $article->category = $validated["category"];
        
        if ($request->has("is_published")) {
            $wasPublished = $article->is_published;
            $article->is_published = $request->boolean("is_published");
            if (!$wasPublished && $article->is_published) {
                $article->published_at = now();
            }
        }

        if ($request->hasFile("thumbnail")) {
            if ($article->thumbnail_path) {
                $oldPath = str_replace("/storage/", "", $article->thumbnail_path);
                Storage::disk("public")->delete($oldPath);
            }
            $path = $request->file("thumbnail")->store("articles", "public");
            $article->thumbnail_path = "/storage/" . $path;
        }

        $article->save();

        return response()->json($article);
    }

    public function destroy($id)
    {
        $article = Article::findOrFail($id);
        if ($article->thumbnail_path) {
            $oldPath = str_replace("/storage/", "", $article->thumbnail_path);
            Storage::disk("public")->delete($oldPath);
        }
        $article->delete();
        return response()->json(["message" => "Deleted successfully"]);
    }
}

