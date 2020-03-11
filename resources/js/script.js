(function ($) {
    'use strict';
    $('.animsition').animsition({
        loadingClass: 'preloader',
        loadingInner: '<div class="spinner"><div class="double-bounce1"></div><div class="double-bounce2"></div></div>'
    });
    $('.a-nav-toggle').on('click', function () {
        if ($('html').hasClass('body-menu-opened')) {
            $('html').removeClass('body-menu-opened').addClass('body-menu-close');
        } else {
            $('html').addClass('body-menu-opened').removeClass('body-menu-close');
        }
    });
    var offset = 100;
    $(window).scroll(function () {
        var scroll = $(window).scrollTop();
        if (scroll >= offset) {
            $('#sidebar').removeClass('sidebar-affix');
            $('#shopping-cart-link').removeClass('sidebar-affix');
        } else {
            $('#sidebar').addClass('sidebar-affix');
            $('#shopping-cart-link').addClass('sidebar-affix');
        }
    });
    $(function () {
        var scroll = $(window).scrollTop();
        if (scroll >= offset) {
            $('#sidebar').removeClass('sidebar-affix');
            $('#shopping-cart-link').removeClass('sidebar-affix');
        } else {
            $('#sidebar').addClass('sidebar-affix');
            $('#shopping-cart-link').addClass('sidebar-affix');
        }
        $('.albums img').each(function () {
            $(this).css({ transform: 'rotate(' + (Math.random() - 0.5) * 15 + 'deg)' })
        })
    })
    $('.navbar-nav a, .menu-main a, .a-scroll').bind('click', function (event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top - 40
        }, 1000);
        event.preventDefault();
    });
    $('.menu-main a').on('click', function () {
        $('html').removeClass('body-menu-opened').addClass('body-menu-close');
    });
    var fullHeight = function () {
        $('.js-fullheight').css('height', $(window).height());
        $(window).resize(function () {
            $('.js-fullheight').css('height', $(window).height());
        });
    };
    fullHeight();
    $('#sidebarCollapse').on('click', function () {
        $('body').toggleClass('sidebar-active');
    });

    var openPhotoSwipe = function (album) {
        require([
            'photoswipe',
            'photoswipe/dist/photoswipe-ui-default.js'
        ], function (PhotoSwipe, PhotoSwipeUI_Default) {
            axios
                .get("/photos/" + album)
                .then(function (res) {
                    var pswpElement = document.querySelectorAll('.pswp')[0];
                    var items = res.data.data;
                    var options = {
                        index: 0,
                        closeOnScroll: false
                    };
                    console.log(items, options)
                    var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
                    gallery.init();
                })

        })
    }
    $(function () {
        $('[data-photoswipe]').click(function () {
            var album_id = $(this).data('photoswipe');
            openPhotoSwipe(album_id);
        })
    })
}($))