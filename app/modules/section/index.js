modules.section = function(){

    this.section = null;
    this.sections = null;
    this.mainSections = null;

    this.init = function () {
        self.reloadSections();
    };

    this.reloadSections = function () {

        if (self.section) {

            services.api.getSections(self.section.id, function(sections){
                self.sections = sections.sections;
                self.drawSections();
            });

            return;
        }

        services.api.getSections(null, function(sections){
            self.mainSections = sections.sections;
            self.sections = sections.sections;
            self.drawSections();
        });
    };

    this.drawSections = function(){

        if (self.section) {

            var viewData = {
                sections: self.sections,
                section: self.section
            };
            self.view.render('section/view/sub-section', viewData, function(renderedHtml){
                $(self.element).html(renderedHtml);
            });
        }
        else {
            self.view.render('section/view/main', {sections: self.sections}, function(renderedHtml){
                $(self.element).html(renderedHtml);
            });
        }

        $(self.element).on('click', '[data-section]', function(){
            self.section = self.sections[$(this).data('index')];
            self.reloadSections();
        })
    };

    var self = this;

};