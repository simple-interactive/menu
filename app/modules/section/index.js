modules.section = function(){

    this.parentId = null;

    this.init = function () {

        services.api.getSections(null, function(sections){
            self.view.render('section/view/main', sections, function(renderedHtml){
                $(self.element).html(renderedHtml);
            });
        });
    };

    var self = this;

};