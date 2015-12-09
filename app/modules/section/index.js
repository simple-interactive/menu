modules.section = function(){

    this.init = function () {

        self.view.render('section/view/index', {}, function(renderedHtml){
            $(self.element).html(renderedHtml);
        });
    };

    var self = this;

};