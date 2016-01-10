modules.cart = function (){

    this.order = null;
    this.needToUpdate = false;
    this.results = false;
    this.ordered = false;

    this.init = function(){

        self.view.render('cart/view/index', {}, function(tpl){

            $('body').prepend(tpl);

            self.updateContent();
            self.needToUpdate = false;

            $('[data-cart-details]')
                .modal({backdrop: 'static'})
                .on('hidden.bs.modal', function(){
                    self.unload();
                });
        });
    };

    this.updateContent = function(){

        self.needToUpdate = true;

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

            $('[data-cart-details]').find('[data-update]').on('click', function(){

                module.load('productDetails', {
                    index: $(this).data('index'),
                    callback: self.updateContent
                });
            });

            $('[data-cart-details]').find('[data-amount-minus]').on('click', function(){
                services.shoppingCart.decrease($(this).data('index'));
                self.updateContent();
            });

            $('[data-cart-details]').find('[data-amount-plus]').on('click', function(){
                services.shoppingCart.increase($(this).data('index'));
                self.updateContent();
            });

            $('[data-cart-details]').find('[data-make-order]').on('click', function(){
                services.api.order(
                    services.shoppingCart.getClearOrders(),
                    function(){
                        self.finished(true);
                    },
                    function(){
                        self.finished(false);
                    }
                );
            });
        });
    };

    this.finished = function(result){

        self.results = result;
        self.ordered = true;
        self.needToUpdate = false;

        $('[data-cart-details]').modal('hide');
    };

    this.unload = function(){

        if (self.params.callback && self.ordered) {
            self.params.callback(self.results);
        }

        delete self.order;
        delete self.results;
        delete self.finished;

        if (self.needToUpdate) {
            modules.layout.shoppingCartUpdated();
        }

        delete self.needToUpdate;

        $(self.element).remove();
        $('[data-cart-details]').remove();
    };

    var self = this;
};