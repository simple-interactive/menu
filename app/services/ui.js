window.services.ui = function(){

    this.init = function () {
        this.swiper();
    };

    this.swiper = function(){

        self.listen('[data-swiper]', function(el){

            if ($(el).data('swiped')) {
                return;
            }

            $(el).wrap('<div class="swiper-container"></div>');
            $(el).addClass('swiper-wrapper');

            if ($(el).data('paging')) {
                $(el).parent().append('<div class="swiper-pagination"></div>');
            }

            var lis = $(el).children();
            var amount = $(el).data('amount');

            for(var i = 0; i < lis.length; i+=amount) {
                lis.slice(i, i+amount).wrapAll('<div class="swiper-slide"></div>');
            }

            var options = {
                direction: 'vertical',
                loop: false,
                spaceBetween: 50
            };

            if ($(el).data('paging')) {
                options.pagination = '.swiper-pagination';
            }

            new Swiper ($(el).parent(), options);

            $(el).attr('data-swiped', 'true');
        });
    };

    this.listen = function (selector, callback) {

        function processElement(element){
            if (!$(element).data('processed')) {
                $(element).data('processed', true);
                callback(element);
            }
        }

        $(document).bind('DOMNodeInserted', function(e){
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

    var self = this;
};