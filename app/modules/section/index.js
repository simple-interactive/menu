modules.section = function(){

    this.section = null;
    this.sections = null;

    this.init = function () {

        self.section = self.params.section;
        self.reloadSections();
    };

    this.reloadSections = function () {

        services.api.getSections(self.section.id, function(sections){

            self.sections = sections.sections;
            self.drawMenu();
        });
    };

    this.drawMenu = function(){

        var viewData = {
            sections: self.sections,
            section: self.section
        };
        self.view.render('section/view/index', viewData, function(renderedHtml){
            $(self.element).html(renderedHtml);
        });

        $(self.element).on('click', '[data-section]', function(){

            self.section = self.sections[$(this).data('index')];

            if (self.section.productsCount) {
                self.reloadSections();
            }
            else {
                var section = self.section;
                module.unload('section');
                module.load('product', {section: section});
            }
        });
    };

    this.unload = function(){

        delete self.section;
        delete self.sections;

        $(self.element).remove();
    };

    var self = this;
};