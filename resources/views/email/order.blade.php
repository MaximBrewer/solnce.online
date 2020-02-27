<div>
    {{ __("Name") }}: {{ $order->name }}
</div>
<div>
    {{ __("Phone") }}: {{ $order->phone }}
</div>
<div>
    {{ __("Cart") }}:
</div>
<div>
    @foreach($items as $item)
    <div>
        {{ __("Seedling") }}: {{ $item->name }}
    </div>
    <div>
        {{ __("Quantity") }}: {{ $item->quantity }}
    </div>
    @endforeach
</div>