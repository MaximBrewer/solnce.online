<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use TCG\Voyager\Models\Page;
use Darryldecode\Cart\Facades\CartFacade as Cart;
use App\Seedling;
use App\Photo;
use App\Album;
use Intervention\Image\Facades\Image;

class NfsController extends Controller
{
    //
    public function index(Request $r)
    {

        $pages = Page::where('site', 'nfs')->get();

        foreach ($pages as &$page) {
            if ($page->slug == 'recreation') {
                $albums = Album::all();
                foreach ($albums as &$album) {
                    foreach ($album->photos as &$photo) {
                        if (!is_file(storage_path() . '/app/public/resize/w250h250/' . $photo->photo)) {

                            if (is_file(storage_path() . '/app/public/' . $photo->photo)) {
                                $image = Image::make(storage_path() . '/app/public/' . $photo->photo)->fit(250, 250, function ($img) {
                                    $img->upsize();
                                });
                                $dir = str_replace('app/public', 'app/public/resize/w250h250', $image->dirname);
                                @mkdir($dir, 0777, true);
                                $image->save(storage_path() . '/app/public/resize/w250h250/' . $photo->photo);

                                $photo->thumbnail = 'resize/w250h250/' . $photo->photo;
                            }
                        } else {

                            $photo->thumbnail = 'resize/w250h250/' . $photo->photo;
                        }
                    }
                }
                $page->albums = $albums;
            }
        }

        $cart = Cart::getContent();

        return view('nfs', compact('pages', 'cart'));
    }
}
