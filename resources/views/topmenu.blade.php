<ul class="list-unstyled components">
    @foreach($items as $menu_item)
    @if($menu_item->url == '#calculator')
    <li><a href="#" class="nav-link" data-toggle="modal" data-target="#calculator-modal">{{ $menu_item->title }}</a></li>
    @else
    <li><a href="{{ $menu_item->url }}" class="nav-link a-scroll">{{ $menu_item->title }}</a></li>
    @endif
    @endforeach
</ul>