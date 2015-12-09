modules.layout = function(){

    this.init = function () {

        self.view.render('layout/view/index', {}, function(renderedHtml){
            $(self.element).html(renderedHtml);
        });

        module.load('section');
    };

    var self = this;
};