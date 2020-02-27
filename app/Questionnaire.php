<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;
use App\Mail\Questionnaire as QuestionnaireMail;

class Questionnaire extends Model
{
    protected $fillable = [
        'fcs',
        'email',
        'phone',
        'birthdate',
        'region',
        'education',
        'directrion',
        'description',
        'link',
        'photo',
    ];

    public function setBirthdateAttribute($value)
    {
        $this->attributes['birthdate'] = new Carbon($value);
    }

    public static function boot()
    {
        parent::boot();

        self::created(function ($model) {
            Mail::to('olya-live-9008@mail.ru')->send(new QuestionnaireMail($model));
        });
    }
}
