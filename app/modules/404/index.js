modules['404'] = new (function(){

    this.init = function () {
        self.view.render('404/view/index', {}, function(renderedHtml){
            $(self.element).html(renderedHtml);
        });
    };

    var self = this;

})();