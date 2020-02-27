@php
$relationshipData = (isset($data)) ? $data : $dataTypeContent;
$model = app($options->model);

$items = $model::where($options->column, '=', $relationshipData->id)->get();
@endphp
@if(empty($items))
<p>{{ __('voyager::generic.no_results') }}</p>
@else
<ul>
    @foreach($items as $item)
    <li><a href="/admin/skus/{{ $item->id }}/edit">{{ $item->volume }}</a></li>
    @endforeach
</ul>
@endif