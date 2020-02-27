<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Seedling;
use Intervention\Image\Facades\Image;
use App\Http\Resources\Seedling as SeedlingResource;
use App\Http\Resources\SeedlingFull as SeedlingFullResource;
use App\Http\Resources\SeedlingCalc as SeedlingCalcResource;

class SeedlingsController extends Controller
{
    public function index()
    {
        return SeedlingResource::collection(Seedling::all());
    }
    public function show($id)
    {
        return new SeedlingFullResource(Seedling::findOrFail($id));
    }
    public function calc()
    {
        return SeedlingCalcResource::collection(Seedling::all());
    }
}
