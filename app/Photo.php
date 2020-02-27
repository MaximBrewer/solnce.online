<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Intervention\Image\Facades\Image;

class Photo extends Model
{
    protected $fillable = [
    	'album_id',
    	'photo',
    	'title'
    ];
    

    public static function boot()
    {
        parent::boot();

        self::creating(function($model){
            $image = Image::make(storage_path() . '/app/public/' . $model->photo);
            $model->width = $image ->width();
            $model->height = $image ->height();
        });

        self::created(function($model){
            // ... code here
        });

        self::updating(function($model){
            $image = Image::make(storage_path() . '/app/public/' . $model->photo);
            $model->width = $image ->width();
            $model->height = $image ->height();
        });

        self::updated(function($model){
            // ... code here
        });

        self::deleting(function($model){
            // ... code here
        });

        self::deleted(function($model){
            // ... code here
        });
    }

    public function album(){
    	return $this->belongsTo('App/Album');
    }
}
