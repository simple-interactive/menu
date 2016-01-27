modules.product = function(){

    this.section = null;
    this.products = null;

    this.eventType = 'touchstart';

    this.init = function () {

        self.section = self.params.section;

        services.api.getSectionProducts(self.section.id, null, null, function(products){

            self.products = products.products;

            var temparray = [];

            var swiperOptions = {
                direction: 'vertical',
                loop: false,
                spaceBetween: 50
            };

            var i,j,chunk = 8;
            for (i=0,j=self.products.length; i<j; i+=chunk) {
                temparray.push(self.products.slice(i,i+chunk));
            }

            if (temparray.length > 1) {
                swiperOptions.pagination = '.swiper-pagination';
            }

            var data = {
                section: self.section,
                products: temparray
            };

            if (self.products.length > 8) {
                self.eventType = 'click';
            }

            self.view.render('product/view/index', data, function(tpl){

                $(self.element).html(tpl);

                if (self.products.length > 8) {
                    new Swiper ($(self.element).find('.swiper-container'), swiperOptions);
                }

                $(self.element).on(self.eventType, '[data-product]', function(){

                    var productElement = $(this);

                    self.view.render('product/view/description', {product: self.products[productElement.data('index')]}, function(tpl){
                        $('body').prepend(tpl);

                        $('[data-product-description]').on('touchstart', function(){
                            $('[data-product-description] .product-description-content').transition({opacity: 0});
                            setTimeout(function(){
                                $('[data-product-description]').remove();
                            }, config.animation.duration);
                        });

                        $('[data-product-description] .product-description-content div').on('touchstart', function(e){
                            e.stopPropagation();
                        });

                        var top = 14+Math.floor(productElement.index() / 4)*262 + "px";
                        var left = 211+Math.floor(productElement.index() % 4)*225 + "px";

                        $('[data-product-description] .product-description-content').css({
                            top: top,
                            left: left
                        });

                        $('[data-product-description] .product-description-content').transition({
                            opacity: 1
                        });
                    });
                });

                $(self.element).on(self.eventType, '[data-plus]', function(e){

                    e.stopPropagation();

                    services.shoppingCart.add(self.products[$(this).data('index')]);

                    module.load('productDetails', {
                        index: services.shoppingCart.getAmount()-1,
                        isTemporary: true
                    });
                });

                self.showUi();
            });
        });
    };

    this.showUi = function(){

        $(self.element).find('[data-product-header]').transition({opacity: 1});
        $(self.element).find('[data-product]').transition({opacity: 1});
    };

    this.unload = function(){

        delete self.section;
        delete self.products;

        delete self.eventType;

        $(self.element).remove();
    };

    var self = this;
};