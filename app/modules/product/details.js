modules.productDetails = function(){

    this.order = null;

    this.init = function(){

        self.order = services.shoppingCart.getOrders()[self.params.index];

        self.view.render('product/view/details', {}, function(tpl){

            $('body').append(tpl);

            $('[data-product-details]')
                .modal({backdrop: 'static'})
                .on('hidden.bs.modal', function(){
                    self.unload();
                });

            self.drawOrder();
        });
    };

    this.drawOrder = function(){

        self.view.render('product/view/details-content', {order: self.order}, function(tpl){

            $('[data-product-details]').find('.modal-body').html(tpl);

            $('[data-product-details]').find('[data-product-plus]').on('touchstart', function(){
                services.shoppingCart.increase(self.params.index);
                self.drawOrder();
            });

            $('[data-product-details]').find('[data-product-minus]').on('touchstart', function(){
                services.shoppingCart.decrease(self.params.index);
                self.drawOrder();
            });

            $('[data-product-details]').find('[data-option-plus]').on('touchstart', function(){
                services.shoppingCart.increaseOption(self.params.index, $(this).data('index'));
                self.drawOrder();
            });

            $('[data-product-details]').find('[data-option-minus]').on('touchstart', function(){
                services.shoppingCart.decreaseOption(self.params.index, $(this).data('index'));
                self.drawOrder();
            });

            $('[data-product-details]').find('[data-add-to-cart]').on('touchstart', function(){

                if (self.params.callback) {
                    self.params.callback();
                }
                else {
                    modules.layout.shoppingCartUpdated();
                }

                $('[data-product-details]').modal('hide');
            });

            $('[data-product-details]').find('[data-dismiss]').on('touchstart', function(){
                if (self.params.isTemporary) {
                    services.shoppingCart.remove(self.params.index);
                }
                $('[data-product-details]').modal('hide');
            });
        });
    };

    this.unload = function(){

        delete self.order;

        $('[data-product-details]').remove();
    };

    var self = this;
};