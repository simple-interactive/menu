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
                self.initiateMenu();
            });

            return;
        }

        services.api.getSections(null, function(sections){

            self.mainSections = sections.sections;
            self.sections = sections.sections;

            self.drawSections();
        });
    };

    this.initiateMenu = function(){

        self.view.render('section/view/menu', {sections: self.mainSections}, function(menu){

            $(self.element).find('[data-container-menu]').html(menu);

            $(self.element).on('click', '[data-menu-open]', function(){
                $(self.element).find('[data-container-menu] .menu').addClass('open');

                $(self.element).find('[data-container-menu] .menu-backdrop').show();
                $(self.element).find('[data-container-menu] .menu-backdrop').addClass('open');
            });

            $(self.element).on('click', '[data-menu-close]', function(){

                $(self.element).find('[data-container-menu] .menu').removeClass('open');
                $(self.element).find('[data-container-menu] .menu-backdrop').removeClass('open');

                setTimeout(function () {
                    $(self.element).find('[data-container-menu] .menu-backdrop').hide();
                }, 150)
            });

            $(self.element).on('click', '[data-main-section]', function(){

                self.section = self.mainSections[$(this).data('index')];

                $(self.element).find('[data-container-menu] .menu').removeClass('open');
                $(self.element).find('[data-container-menu] .menu-backdrop').removeClass('open');

                setTimeout(function () {
                    $(self.element).find('[data-container-menu] .menu-backdrop').hide();
                    self.reloadSections();
                }, 150)

            });
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