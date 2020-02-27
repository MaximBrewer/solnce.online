<?php

namespace App\Http\Controllers;

use App\Questionnaire;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Constraint;
use Intervention\Image\Facades\Image as InterventionImage;
use Illuminate\Http\Request;

class QuestionnaireController extends Controller
{

    public function store(Request $r)
    {
        $r->validate([
            'fcs' => 'required',
            'email' => 'required',
            'phone' => 'required',
            'birthdate' => 'required',
            'region' => 'required',
            'education' => 'required',
            'directrion' => 'required',
            'description' => 'required',
            'link' => 'required',
            'photo' => 'required',
        ]);

        $attributes = $r->all();

        if ($r->hasfile('photo')) {
            $file = $r->file('photo');
            $extension = $file->getClientOriginalExtension();
            $path = 'questionnaire' . DIRECTORY_SEPARATOR . date('FY') . DIRECTORY_SEPARATOR;
            $fullpath = storage_path() . DIRECTORY_SEPARATOR . 'app' . DIRECTORY_SEPARATOR . 'public' . DIRECTORY_SEPARATOR . $path;
            @mkdir($fullpath, 0777, true);
            do {
                $filename = Str::random(20);
            } while (is_file($fullpath . $filename . '.' . $file->getClientOriginalExtension()));
            $file->move($fullpath, $filename . '.' . $extension);
            $attributes['photo'] = $path . $filename . '.' . $extension;
        } else {
            return response()->json([
                'message' => __('Photo is required!'),
                'errors' => [
                    'photo' => [
                        'Photo is required!'
                    ]
                ]
            ], 422);
        }

        return Questionnaire::create($attributes);
    }
}
