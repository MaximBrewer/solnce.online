<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class SeedlingCalc extends JsonResource
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
            'name' => $this->title,
            'prices' => [
                ['age' => 3, 'val' => $this->price_3],
                ['age' => 4, 'val' => $this->price_4],
                ['age' => 5, 'val' => $this->price_5],
                ['age' => 6, 'val' => $this->price_6],
                ['age' => 7, 'val' => $this->price_7],
                ['age' => 8, 'val' => $this->price_8],
                ['age' => 9, 'val' => $this->price_9],
            ],
            'productivity' => [
                ['age' => 3, 'min' => $this->min_3, 'max' => $this->max_3],
                ['age' => 4, 'min' => $this->min_4, 'max' => $this->max_4],
                ['age' => 5, 'min' => $this->min_5, 'max' => $this->max_5],
                ['age' => 6, 'min' => $this->min_6, 'max' => $this->max_6],
                ['age' => 7, 'min' => $this->min_7, 'max' => $this->max_7],
                ['age' => 8, 'min' => $this->min_8, 'max' => $this->max_8],
                ['age' => 9, 'min' => $this->min_9, 'max' => $this->max_9],
            ],
            'beginning_fruiting' => $this->beginning_fruiting,
            'fruit_bearing' => $this->fruit_bearing,
            'fruiting' => $this->fruiting,
            'fruitPrice' => $this->fruit_price
        ];
    }
}
