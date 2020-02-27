<ul>
    @foreach($items as $menu_item)
    @if($menu_item->url == '#calculator')
    <li><a href="#" data-toggle="modal" data-target="#calculator-modal">{{ $menu_item->title }}</a></li>
    @else
    <li><a href="{{ $menu_item->url }}">{{ $menu_item->title }}</a></li>
    @endif
    @endforeach
</ul>
