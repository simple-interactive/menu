window.services.shoppingCart = function(){

    var self = this;

    this.list = [];

    try {
        self.list = JSON.parse(storage.getItem('cart-list'));
    }
    catch(e){}

    this.amount = 0;
    this.price = 0;

    this.shoppingCartCallback = null;

    this.setShoppingCartCallback = function(callback){
        self.shoppingCartCallback = callback;
        self.updateMeta();
    };

    this.add = function(order){
        self.list.push(order);
        self.updateMeta();
    };

    this.getClearOrders = function(){

        var order = [];

        for (var i=0; i<self.list.length; i++) {

            var options = [];
            console.log(i, self.list[i]);

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
                product: self.list[i].product.id,
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

    this.updateOrders = function(orders){
        self.list = orders;
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

                if (self.list[i].options[j].amount) {

                    self.list[i].options[j].totalPrice = self.list[i].options[j].price * self.list[i].options[j].amount;

                    self.list[i].priceTotal +=  self.list[i].options[j].totalPrice * self.list[i].amount;
                    self.list[i].pricePerOne += self.list[i].options[j].totalPrice;
                }
            }

            self.price += self.list[i].priceTotal;
        }

        storage.setItem('cart-list', JSON.stringify(self.list));

        if (self.shoppingCartCallback) {
            self.shoppingCartCallback();
        }
    };

    this.updateMeta();
};