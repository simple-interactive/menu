window.services.ui = function(){

    this.init = function () {

        this.initiateAnimated();
        this.swiper();
    };

    this.swiper = function(){

        self.listen('[data-swiper]', function(el){

            if ($(el).data('swiped')) {
                return;
            }

            $(el).wrap('<div class="swiper-container"></div>');
            $(el).addClass('swiper-wrapper');
            $(el).parent().append('<div class="swiper-pagination"></div>');

            var lis = $(el).children();
            var amount = $(el).data('amount');

            for(var i = 0; i < lis.length; i+=amount) {
                lis.slice(i, i+amount).wrapAll('<div class="swiper-slide"></div>');
            }

            new Swiper ($(el).parent(), {
                // Optional parameters
                direction: 'vertical',
                loop: false,
                pagination: '.swiper-pagination',
                spaceBetween: 50
            });

            $(el).attr('data-swiped', 'true');
        });
    };

    this.listen = function (selector, callback) {

        function processElement (element) {
            if (!$(element).data('processed')) {
                $(element).data('processed', true);
                callback(element);
            }
        }

        $(document).bind('DOMNodeInserted', function(e) {
            if ($(e.target).is(selector)) {
                processElement(e.target);
            }
            $(e.target).find(selector).each(function(){
                processElement(this);
            });
        });

        if ($(selector).size()) {
            processElement($(selector).get());
        }
    };

    this.initiateAnimated = function(){

        (function($) {

            $.fn.animate = function (type) {

                this.removeClass(type);
                var self = this;

                setTimeout(function () {
                    self.addClass('animated');
                    self.addClass(type);
                }, 1);
            };

        })(jQuery);
    };

    var self = this;
};