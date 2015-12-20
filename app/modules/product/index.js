modules.product = function(){

    this.section = null;
    this.products = null;

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

            self.view.render('product/view/index', data, function(tpl){

                $(self.element).html(tpl);

                new Swiper ($(self.element).find('.swiper-container'), swiperOptions);

                $(self.element).on('click', '[data-product]', function(){});

                $(self.element).on('click', '[data-plus]', function(){
                    self.productDetails(self.products[$(this).data('index')]);
                    return false;
                });
            });
        });
    };

    this.productDetails = function(product){
        self.view.render('product/view/details', {product: product}, function(tpl){
            $('body').append(tpl);
            $('[data-product-details]')
                .modal({backdrop: false})
                .on('hidden.bs.modal', function(){
                    $(this).remove();
                });
        });
    };

    this.unload = function(){

        delete self.section;
        delete self.products;

        $(self.element).remove();
    };

    var self = this;
};