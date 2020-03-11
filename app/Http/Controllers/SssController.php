<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use TCG\Voyager\Models\Page;
use Darryldecode\Cart\Facades\CartFacade as Cart;
use App\Seedling;
use App\Photo;
use App\Album;
use Intervention\Image\Facades\Image;

class SssController extends Controller
{
    //
    public function index(Request $r)
    {

        $pages = Page::whereIn('site', ['both', 'sss'])->get();

        $cart = Cart::getContent();

        return view('sss', compact('pages', 'cart'));
    }
}
