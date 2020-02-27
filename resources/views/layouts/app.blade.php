<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- Styles -->
    <link href="{{ asset('css/app.css') }}?ver=2.11" rel="stylesheet">
    <link rel="shortcut icon" type="image/png" href="/favicon.png" />
    <link href="https://fonts.googleapis.com/css?family=Marmelad&display=swap" rel="stylesheet">
    <script>
        window._translations = {!! cache('translations'); !!};
    </script>
</head>

</head>

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
                <div class="hide-menu a-nav-toggle"></div>
                <div class="menu">
                    <div class="">
                        <button class="nav-toggle-btn a-nav-toggle d-md-none">
                            <span class="nav-toggle nav-toggle-sm">
                                <span class="stick stick-1"></span>
                                <span class="stick stick-2"></span>
                                <span class="stick stick-3"></span>
                            </span>
                        </button>
                    </div>
                    <div class="menu-main" id="accordion">
                        @php
                        echo menu('nfs', 'mobilemenu')
                        @endphp
                    </div>
                    <div class="menu-footer">
                        <div class="menu-copyright">&copy; 2020</div>
                    </div>
                </div>
                <div id="content">
                    <div class="promo">
                        <div class="container">
                            <div class="substrate-">
                                <div class="row">
                                    <div class="col-md-5">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    @yield('about')
                    @yield('legal')
                    @yield('insureance')
                    @yield('charity')
                    @yield('consultation')
                    @yield('recreation')
                    @yield('shop')
                    @yield('questionnaire')
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
    @yield('calculator')
    <!-- Scripts -->
    <script src="{{ asset('js/js_utils.js') }}" defer></script>
    <script src="{{ asset('js/app.js') }}?ver=3.13" defer></script>
</body>

</html>