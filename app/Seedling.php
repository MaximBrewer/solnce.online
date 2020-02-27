<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Intervention\Image\Facades\Image;

class Seedling extends Model
{

    private static function saveThumbs($model)
    {
        if (!is_file(storage_path() . '/app/public/resize/w250h250/' . $model->image)) {

            if (is_file(storage_path() . '/app/public/' . $model->image)) {
                $image = Image::make(storage_path() . '/app/public/' . $model->image)->fit(250, 250, function ($img) {
                    $img->upsize();
                });
                $dir = str_replace('app/public', 'app/public/resize/w250h250', $image->dirname);
                @mkdir($dir, 0777, true);
                $image->save(storage_path() . '/app/public/resize/w250h250/' . $model->image);
            }
        }
    }

    public static function boot()
    {
        parent::boot();

        self::creating(function ($model) {
        });

        self::created(function ($model) {
            self::saveThumbs($model);
        });

        self::updating(function ($model) {
        });

        self::updated(function ($model) {
            self::saveThumbs($model);
        });

        self::deleting(function ($model) {
            // ... code here
        });

        self::deleted(function ($model) {
            // ... code here
        });
    }
}
