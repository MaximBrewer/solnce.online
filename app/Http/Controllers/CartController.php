<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Darryldecode\Cart\Facades\CartFacade as Cart;
use App\Seedling;
use App\Order;
use App\Basket;
use App\Mail\Order as MailOrder;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Mail;
use App\Mail\Order as OrderMail;

class CartController extends Controller
{
    //
    public function index(Request $r)
    {
    }
    //
    public function addSeedling(Request $r)
    {
        $seedling = Seedling::findOrFail($r->post('id'));
        Cart::add(array(
            array(
                'id' => $seedling->id,
                'name' => $seedling->title,
                'price' => 7000,
                'quantity' => (int) $r->post('quantity'),
                'attributes' => array(),
                'associatedModel' => 'Seedling'
            )
        ));
        return Cart::getContent();
    }
    //
    public function removeSeedling($id)
    {
        $seedling = Seedling::findOrFail($id);
        Cart::remove($seedling->id);
        return Cart::getContent();
    }
    //
    public function getSeedling(Request $r)
    {
        return Cart::getContent();
    }
    //
    public function order(Request $r)
    {
        $items = Cart::getContent();

        $r->validate([
            'name' => 'required|min:3',
            'phone' => 'required|min:10',
        ]);

        if (count($items)) {

            $order = Order::create($r->all());

            foreach ($items as $item) {
                $basket = Basket::create([
                    'order_id' => $order->id,
                    'seedling_id' => $item->id,
                    'quantity' => $item->quantity,
                    'price' => $item->price,
                ]);
            }
        }

        Mail::to('olya-live-9008@mail.ru')->send(new OrderMail($order, $items));

        Cart::clear();

        return [];
    }
}
