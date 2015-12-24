modules.productDetails = function(){

    this.product = null;

    this.init = function(){

        self.product = self.params.product;

        self.view.render('product/view/details', {product: self.product}, function(tpl){

            $('body').append(tpl);

            $('[data-product-details]')
                .modal({backdrop: 'static'})
                .on('hidden.bs.modal', function(){
                    self.unload();
                });


        });
    };

    this.unload = function(){
        delete self.product;

        $('[data-product-details]').remove();
    };

    var self = this;
};