modules.index = function(){

    this.init = function () {

        self.view.render('index/view/index', {}, function(renderedHtml){
            $(self.element).html(renderedHtml);
        });
    };

    var self = this;

};