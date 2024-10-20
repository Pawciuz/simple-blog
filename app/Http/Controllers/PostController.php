<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PostController extends Controller
{
    // List all posts
    public function index()
    {
        $posts = Post::with('user:id,name', 'comments.user:id,name')->get();
        return response()->json($posts);
    }

    // Show the form to create a new post
    public function create(): \Inertia\Response
    {
        return Inertia::render('AddPostPage');
    }

    // Store a new post (authenticated users only)
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $post = Auth::user()->posts()->create($request->only(['title', 'content']));

        return response()->json($post->load('user:id,name'), 201);
    }

    //Show post details
    public function show($id)
    {
        $post = Post::with(['user:id,name', 'comments.user:id,name'])->findOrFail($id);
        return Inertia::render('PostDetailsPage', [
            'post' => $post
        ]);
    }

    // Edit a post (only the owner)
    public function edit($id)
    {
        $post = Post::findOrFail($id);

        if ($post->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized access.'], 403);
        }

        return Inertia::render('EditPostPage', [
            'post' => $post
        ]);
    }

    // Update a post (only the owner)
    public function update(Request $request, $id)
    {
        $post = Post::findOrFail($id);

        if ($post->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized access.'], 403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $post->update($request->only(['title', 'content']));

        return response()->json($post->load('user:id,name'));
    }

    // Delete a post (only the owner)
    public function destroy($id)
    {
        $post = Post::findOrFail($id);

        if ($post->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized access.'], 403);
        }

        $post->delete();

        return response()->json(null, 204);
    }
}
