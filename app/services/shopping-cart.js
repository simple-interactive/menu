window.services.shoppingCart = function(){

    this.list = null;

    this.add = function(product, amount, options){
        self.list.push({
            product: product,
            amount: amount,
            options: options
        });
    };

    this.getList = function(){
        return self.list;
    };

    var self = this;
};