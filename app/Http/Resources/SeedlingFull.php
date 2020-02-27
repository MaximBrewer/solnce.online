<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class SeedlingFull extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'beginning_fruiting' => $this->beginning_fruiting,
            'fruit_bearing' => $this->fruit_bearing,
            'fruiting' => $this->fruiting,
            'season' => $this->season,
            'fruit_price' => $this->fruit_price,
            'fruit_measure_id' => $this->fruit_measure_id,
            'number_of_varieties' => $this->number_of_varieties,
            'image' => '/storage/' . $this->image,
            'price_3' => $this->price_3,
            'price_4' => $this->price_4,
            'price_5' => $this->price_5,
            'price_6' => $this->price_6,
            'price_7' => $this->price_7,
            'price_8' => $this->price_8,
            'price_9' => $this->price_9,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}