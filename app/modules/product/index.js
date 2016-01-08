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

                new Swiper ($(self.element).find('.swiper-container'), swiperOptions);

                $(self.element).on(self.eventType, '[data-product]', function(){

                });

                $(self.element).on(self.eventType, '[data-plus]', function(){
                    module.load('productDetails', {product: self.products[$(this).data('index')]});
                    return false;
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