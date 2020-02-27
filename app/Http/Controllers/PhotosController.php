<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Photo;
use App\Album;
use App\Http\Resources\Photo as PhotoResource;

class PhotosController extends Controller
{
    public function all($id)
    {
        return PhotoResource::collection(Photo::where('album_id', $id)->get());
    }
}
