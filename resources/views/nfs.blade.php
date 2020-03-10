@foreach($pages as $page)
@section($page->slug)
<div class="section" id="{{ $page->slug }}">
    <div class="container">
        <div class="substrate">
            <div class="row">
                <div class="col-lg-12">
                    <h2 class="section-title font-libre">{{ $page->title }}</h2>
                    <div class="section-descr">
                        @if($page->youtube)
                        <div class="page-youtube">
                            <iframe width="100%" src="https://www.youtube.com/embed/{{ $page->youtube }}" frameborder="0"
                                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen></iframe>
                                <br><br><a href="https://vk.com/elbrus7" rel="nofollow" target="_blank">https://vk.com/elbrus7</a>
                        </div>
                        @endif
                        <div class="page-body">
                            {!! $page->body !!}
                            @if ($page->slug == 'consultation')
                            <p>{{ __('Consultation on joining a cooperative') }}:
                                <br><a href="tel:+7 985 076-18-53" class="contel"><i class="fa fa-whatsapp"
                                        aria-hidden="true"></i> +7
                                    985 076-18-53</a></p>
                            <p>{{ __('The advice of the agronomist') }}:
                                <br><a href="tel:+7 918 588-68-48" class="contel"><i class="fa fa-whatsapp"
                                        aria-hidden="true"></i>
                                    +7 918 588-68-48</a></p>
                            <p>{{ __('Contact the project Manager') }}:
                                <br><a href="tel:+7 985 076-18-53" class="contel"><i class="fa fa-whatsapp"
                                        aria-hidden="true"></i> +7
                                    996 408-98-26</a></p>
                            <p>{{ __('Консультация по калькулятору') }}:
                                <br><a href="tel:+7 989 080-93-05" class="contel"><i class="fa fa-whatsapp"
                                        aria-hidden="true"></i>+7 989 080-93-05</a></p>
                            @endif
                        </div>
                    </div>
                </div>
            </div>
            @if($page->albums)
            <div class="row">
                <div class="col-lg-12">
                    <h2 class="section-title font-libre">{{ __('List of tours in Sochi') }}</h2>
                </div>
            </div>
            <div class="row albums">
                @foreach($page->albums as $album)
                <div class="col-xl-3 col-md-4 col-sm-6">
                    <div class="page-item">
                        <a href="javascript:void(0)" data-photoswipe="{{ $album->id }}">
                            <div class="page-item-photo">
                                <div class="zooming">
                                    @foreach($album->photos as $photo)
                                    <img class="lazy" data-src="/storage/{{ $photo->thumbnail }}"
                                        alt="{{ $photo->titile }}" />
                                    @endforeach
                                </div>
                            </div>
                            <div class="page-item-title">{{ $album->name }}</div>
                        </a>
                    </div>
                </div>
                @endforeach
            </div>
            @endif
        </div>
    </div>
</div>
@stop
@endforeach
@section('shop')
<div class="section" id="shop"></div>
@stop
@section('questionnaire')
<div class="section" id="questionnaire"></div>
@stop
@section('calculator')
<div class="modal" tabindex="-1" role="dialog" id="calculator-modal">
    <div class="modal-dialog modal-xxl" role="document">
        <div class="modal-content" style="background: #fff;">
            <div class="modal-header">
                <h5 class="modal-title">Калькулятор Народный доход</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div id="calculator-replace" style="text-align: center">
                    <div style="font-size:6em"><i class="fa fa-rotate-right" aria-hidden="true"></i></div>
                    <p>{{ __('Calculator does not work on small resolution width, try to rotate device.') }}</p>
                </div>
                <div id="calculator">
                    <DIV ID="plant_calc">
                        <FORM NAME="plant_calc" ACTION="#">
                            <DIV CLASS="row top flex stretch x-end">
                                <DIV CLASS="side age_blk flex col between">
                                    <DIV CLASS="title">Возраст<BR>дерева</DIV>
                                    <IMG SRC="/images/side_left_bg.svg" ALT="" CLASS="bg_aligner">
                                    <DIV CLASS="age indicator flex center x-center"><SPAN CLASS="value"></SPAN>
                                    </DIV>
                                    <DIV CLASS="age_radiogroup flex between"></DIV>
                                </DIV>
                                <DIV CLASS="middle qty_blk">
                                    <DIV CLASS="inp_outer flex center">
                                        <IMG SRC="/images/sun.svg" ALT="" CLASS="bg_aligner">
                                        <INPUT TYPE="text" NAME="qty" VALUE="12">
                                    </DIV>
                                    <DIV CLASS="range_outer">
                                        <DIV CLASS="qty range_bar" DATA-MIN="1"
                                            DATA-INPUTS-SELECTOR="#plant_calc input[name='qty']"></DIV>
                                    </DIV>
                                    <DIV CLASS="range_legend">количество</DIV>
                                </DIV>
                                <DIV CLASS="side efficiency_blk flex col between x-end">
                                    <DIV CLASS="title">Стоимость<BR>обслуживания</DIV>
                                    <IMG SRC="/images/side_right_bg.svg" ALT="" CLASS="bg_aligner">
                                    <DIV CLASS="efficiency indicator flex center x-center"><SPAN CLASS="value"></SPAN>
                                    </DIV>
                                    <DIV CLASS="age_radiogroup flex between"></DIV>
                                </DIV>
                            </DIV>
                            <DIV CLASS="row flex between">
                                <DIV CLASS="side flex col start">
                                    <DIV CLASS="plant_price single flex nowrap x-center">цена - <SPAN
                                            CLASS="value">0</SPAN>
                                    </DIV>
                                    <DIV CLASS="fruit_price single flex nowrap x-center">цена плодов - <SPAN
                                            CLASS="value">0</SPAN>
                                    </DIV>
                                    <!-- <LABEL CLASS="checkbox">страховка - <INPUT TYPE="checkbox" NAME="enshurance"></LABEL></DIV> -->
                                </DIV>
                                <DIV CLASS="middle plant_selector_outer">
                                    <DIV CLASS="plant_selector">
                                        <DIV CLASS="list"></DIV>
                                    </DIV>
                                </DIV>
                                <DIV CLASS="side plant_price summary flex nowrap end x-center">стоимость - <SPAN
                                        CLASS="value">0</SPAN>
                                </DIV>
                            </DIV>
                            <DIV CLASS="row table_outer flex center">
                                <TABLE CLASS="pricing_list"></TABLE>
                            </DIV>
                            <DIV CLASS="row flex center">
                                <SUP>*</SUP> &ndash; взята средняя стоимость химических плодов на рынке, в сезон.
                                Напоминаем,
                                что
                                ваши
                                деревья поливаться химией не будут. Соответственно плоды будут органическими и их
                                стоимость
                                исчесляется по
                                более высоким ценам, и продажа планируется не на обычный рынок, а среди тех, кто
                                ценит
                                качество.
                                Но
                                вы сами
                                распоряжаетесь и при желании, можете в любое время здать продукцию на рынке или
                                организовать
                                свою
                                торговую
                                точку.
                            </DIV>
                        </FORM>
                    </DIV>
                </div>
            </div>
        </div>
    </div>
</div>
@stop
<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
@include('layouts.head')
<body class="dark-horizontal theme-white" data-spy="scroll" data-target=".navbar-nav">
    <div class="wrapper align-items-stretch animsition">
        <div class="promo-bg">
            <video style="width:100%;height: 100%;-o-object-fit: fill;object-fit: fill;" autoplay="true" muted
                playsinline loop id="bgvideo">
                <source src="/media/bg.mp4" type="video/mp4">
                <source src="/media/bg.ogg" type="video/ogg">
            </video>
        </div>
        <nav id="sidebar">
            <button type="button" id="sidebarCollapse" class="btn">
                <i class="fa fa-bars"></i>
                <span class="sr-only">Toggle Menu</span>
            </button>
            <div class="p-4 overflow-y">
                @php
                echo menu('nfs', 'topmenu')
                @endphp
            </div>
        </nav>
        <main>
            <div class="wrapper">
                @yield('cart')
                <div id="content">
                    @include('layouts.promo')
                    @yield('about')
                    @yield('legal')
                    @yield('insureance')
                    @yield('charity')
                    @yield('consultation')
                    @yield('recreation')
                    @yield('shop')
                    @yield('questionnaire')
                    @yield('calculator')
                </div>
            </div>
            <div class="footer">
                <div class="container">
                    <div class="row footer-content">
                        <div class="col-lg-6">
                        </div>
                        <div class="col-lg-6">
                        </div>
                    </div>
                    <div class="copyright">{!! __("&copy;&nbsp; 2020 People's orchard") !!}</div>
                </div>
            </div>
        </main>
    </div>
    @yield('cart-modal')
    <div class="container">
        <!-- Root element of PhotoSwipe. Must have class pswp. -->
        <div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">
            <!-- Background of PhotoSwipe. 
         It's a separate element, as animating opacity is faster than rgba(). -->
            <div class="pswp__bg"></div>
            <!-- Slides wrapper with overflow:hidden. -->
            <div class="pswp__scroll-wrap">
                <!-- Container that holds slides. PhotoSwipe keeps only 3 slides in DOM to save memory. -->
                <div class="pswp__container">
                    <!-- don't modify these 3 pswp__item elements, data is added later on -->
                    <div class="pswp__item"></div>
                    <div class="pswp__item"></div>
                    <div class="pswp__item"></div>
                </div>
                <!-- Default (PhotoSwipeUI_Default) interface on top of sliding area. Can be changed. -->
                <div class="pswp__ui pswp__ui--hidden">
                    <div class="pswp__top-bar">
                        <!--  Controls are self-explanatory. Order can be changed. -->
                        <div class="pswp__counter"></div>
                        <button class="pswp__button pswp__button--close" title="Close (Esc)"></button>
                        <button class="pswp__button pswp__button--share" title="Share"></button>
                        <button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>
                        <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>
                        <!-- Preloader demo https://codepen.io/dimsemenov/pen/yyBWoR -->
                        <!-- element will get class pswp__preloader--active when preloader is running -->
                        <div class="pswp__preloader">
                            <div class="pswp__preloader__icn">
                                <div class="pswp__preloader__cut">
                                    <div class="pswp__preloader__donut"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
                        <div class="pswp__share-tooltip"></div>
                    </div>
                    <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)">
                    </button>
                    <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)">
                    </button>
                    <div class="pswp__caption">
                        <div class="pswp__caption__center"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Scripts -->
    <script src="{{ asset('js/js_utils.js') }}" defer></script>
    <script src="{{ asset('js/nfs.js') }}?ver=1.1" defer></script>
    <script src="{{ asset('js/profile.js') }}?ver=1.1" defer></script>
</body>
</html>