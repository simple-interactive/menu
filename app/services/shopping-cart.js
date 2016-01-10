window.services.shoppingCart = function(){

    var self = this;

    this.list = storage.getItem('cart-list') || [];

    this.amount = 0;
    this.price = 0;

    this.add = function(product){

        var options = [];

        for (var i=0; i<product.options.length;i++) {

            options[i] = $.extend(true, {}, product.options[i]);
            options[i].amount = 0;
            options[i].totalPrice = 0;
        }

        self.list.push({
            product: product,
            amount: 1,
            options: options
        });

        self.updateMeta();
    };

    this.getClearOrders = function(){

        var order = [];

        for (var i=0; i<self.list.length; i++) {

            var options = [];

            for (var j=0; j<self.list[i].options.length; j++) {

                if (self.list[i].options[j].amount) {

                    options.push({
                        option: j,
                        amount: self.list[i].options[j].amount
                    });
                }
            }

            order.push({
                options: options,
                amount: self.list[i].amount,
                product: self.list[i].product.id
            });
        }

        return order;
    };

    this.getOrders = function(){
        return self.list;
    };

    this.getTotalPrice = function(){
        return self.price;
    };

    this.getAmount = function(){
        return self.amount;
    };

    this.remove = function(index){
        self.list.splice(index, 1);
        self.updateMeta();
    };

    this.increase = function(index){
        ++self.list[index].amount;
        self.updateMeta();
    };

    this.decrease = function(index){

        if (self.list[index].amount-1 == 0) {
            return;
        }

        --self.list[index].amount;
        self.updateMeta();
    };

    this.increaseOption = function(orderIndex, optionIndex){
        ++self.list[orderIndex].options[optionIndex].amount;
        self.updateMeta();
    };

    this.decreaseOption = function(orderIndex, optionIndex){

        if (self.list[orderIndex].options[optionIndex].amount == 0) {
            return;
        }

        --self.list[orderIndex].options[optionIndex].amount;
        self.updateMeta();
    };

    this.updateOrders = function(orders){
        self.list = orders;
        self.updateMeta();
    };

    this.clear = function(){
        self.list = [];
        self.updateMeta();
    };

    this.updateMeta = function(){

        self.amount = self.list.length;
        self.price = 0;

        for (var i=0; i<self.list.length; i++) {

            self.list[i].priceTotal = self.list[i].product.price * self.list[i].amount;
            self.list[i].priceWithoutOptions = self.list[i].product.price * self.list[i].amount;
            self.list[i].pricePerOne = self.list[i].product.price;

            for (var j=0; j < self.list[i].options.length; j++) {

                self.list[i].options[j].totalPrice = 0;

                if (self.list[i].options[j].amount) {

                    self.list[i].options[j].totalPrice = self.list[i].options[j].price * self.list[i].options[j].amount;

                    self.list[i].priceTotal +=  self.list[i].options[j].totalPrice * self.list[i].amount;
                    self.list[i].pricePerOne += self.list[i].options[j].totalPrice;
                }
            }

            self.price += self.list[i].priceTotal;
        }

        storage.setItem('cart-list', self.list);
    };

    this.updateMeta();
};