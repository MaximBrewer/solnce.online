<?php

namespace App;

use Illuminate\Database\Eloquent\Model;


class Sku extends Model
{
    public function product()
    {
        return $this->belongsTo('App\Product');
    }
}
