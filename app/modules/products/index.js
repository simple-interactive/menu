modules.products = function(){

    this.init = function () {

        self.view.render('products/view/index', {}, function(tpl){
            $(self.element).html(tpl);
        });

        module.load('section');
    };

    var self = this;
};