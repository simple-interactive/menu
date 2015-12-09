modules.stylize = function(){

    this.init = function () {

        services.api.getStyles(function(styles){

            self.view.render('stylize/view/index', styles, function(renderedHtml){
                $(self.element).html(renderedHtml);
            });

        });
    };

    var self = this;
};