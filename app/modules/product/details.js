modules.productDetails = function(){

    this.product = null;
    this.order = {
        product: null,
        amount: 1,
        options: []
    };

    this.init = function(){

        self.product = $.extend(true, {}, self.params.product);

        self.order.product = self.product;

        self.order.options = self.product.options;

        self.view.render('product/view/details', {product: self.product, order: self.order}, function(tpl){

            $('body').append(tpl);

            $('[data-product-details]')
                .modal({backdrop: 'static'})
                .on('hidden.bs.modal', function(){
                    self.unload();
                });

            self.drawOrder();
        });
    };

    this.getVars = function(){

        var productPrice = self.order.amount*self.product.price;
        var totalOptionsPrice = 0;

        for (var i=0; i<self.order.options.length; i++) {

            if (!self.order.options[i].amount) {
                self.order.options[i].amount = 0;
            }
            totalOptionsPrice += self.order.options[i].amount * self.order.options[i].price;
            self.order.options[i].totalPrice = self.order.options[i].amount * self.order.options[i].price;
        }

        var totalPrice = (totalOptionsPrice * self.order.amount) + productPrice;

        return {
            product: self.product,
            order: self.order,
            productPrice: productPrice,
            totalPrice: totalPrice
        };
    };

    this.drawOrder = function(){

        self.view.render('product/view/details-content', self.getVars(), function(tpl){

            $('[data-product-details]').find('.modal-body').html(tpl);

            $('[data-product-details]').find('[data-product-plus]').on('touchstart', function(){
                ++self.order.amount;
                self.drawOrder();
            });

            $('[data-product-details]').find('[data-product-minus]').on('touchstart', function(){

                if (self.order.amount < 2) {
                    return false;
                }

                --self.order.amount;
                self.drawOrder();
            });

            $('[data-product-details]').find('[data-option-plus]').on('touchstart', function(){
                ++self.order.options[$(this).data('index')].amount;
                self.drawOrder();
            });

            $('[data-product-details]').find('[data-option-minus]').on('touchstart', function(){

                if (self.order.options[$(this).data('index')].amount < 1) {
                    return false;
                }

                --self.order.options[$(this).data('index')].amount;
                self.drawOrder();
            });

            $('[data-product-details]').find('[data-add-to-cart]').on('touchstart', function(){

                if (self.order.amount < 1) {
                    return false;
                }

                services.shoppingCart.add(self.order);
                $('[data-product-details]').modal('hide');
            });
        });
    };

    this.unload = function(){

        delete self.product;
        delete self.order;

        $('[data-product-details]').remove();
    };

    var self = this;
};