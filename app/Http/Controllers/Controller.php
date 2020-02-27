<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use TCG\Voyager\Http\Controllers\Controller as ControllersController;

class Controller extends ControllersController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;
}
