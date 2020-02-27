<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Album extends Model
{
    //
    protected $fillable = [
        'name'
    ];
    public function photos()
    {
        return $this->hasMany('App\Photo')->limit(10);
    }
    public function allPhotos()
    {
        return $this->hasMany('App\Photo');
    }
}
