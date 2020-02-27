<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Basket extends Model
{
    protected $fillable = [
        'order_id',
        'price',
        'quantity',
        'seedling_id'
    ];
}
