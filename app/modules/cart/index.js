modules.cart = function (){

    this.order = null;

    this.init = function(){

        self.view.render('cart/view/index', {}, function(tpl){

            $('body').prepend(tpl);

            self.updateContent();

            $('[data-cart-details]')
                .modal({backdrop: 'static'})
                .on('hidden.bs.modal', function(){
                    self.unload();
                });
        });
    };

    this.updateContent = function(){

        if (!services.shoppingCart.getOrders().length) {
            $('[data-cart-details]').modal('hide');
            return;
        }

        var tplData = {
            orders: services.shoppingCart.getOrders(),
            amount: services.shoppingCart.getAmount(),
            price: services.shoppingCart.getTotalPrice()
        };

        self.view.render('cart/view/cart-content', tplData, function(tpl){

            $('[data-cart-content]').html(tpl);

            $('[data-cart-details]').find('[data-delete]').on('click', function(){
                services.shoppingCart.remove($(this).data('index'));
                self.updateContent();
            });

            $('[data-cart-details]').find('[data-amount-minus]').on('click', function(){
                services.shoppingCart.decrease($(this).data('index'));
                self.updateContent();
            });

            $('[data-cart-details]').find('[data-amount-plus]').on('click', function(){
                services.shoppingCart.increase($(this).data('index'));
                self.updateContent();
            });
        });
    };

    this.unload = function(){

        delete self.order;

        $(self.element).remove();
        $('[data-cart-details]').remove();
    };

    var self = this;
};