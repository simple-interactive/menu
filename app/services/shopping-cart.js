window.services.shoppingCart = function(){

    this.list = [];
    this.amount = 0;
    this.price = 0;

    this.shoppingCartCallback = null;

    this.setShoppingCartCallback = function(callback){
        self.shoppingCartCallback = callback;
    };

    this.add = function(order){

        self.list.push(order);
        self.amount = self.list.length;
        self.price = 0;

        for (var i=0; i<self.list.length; i++) {
            self.price += self.list[i].totalPrice;
        }

        if (self.shoppingCartCallback) {
            self.shoppingCartCallback(self.getOrders());
        }
    };

    this.getOrders = function(){
        return {
            orders: self.list,
            price: self.price,
            amount: self.amount
        };
    };

    var self = this;
};