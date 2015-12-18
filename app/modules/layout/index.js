modules.layout = function(){

    this.sections = null;

    this.init = function () {

        services.api.getSections(null, function(sections){

            self.sections = sections.sections;

            self.view.render('layout/view/index', sections, function(tpl){

                $(self.element).html(tpl);

                $(self.element).on('click', '[data-section]', function(){

                    self.initiateMenu();
                    $(self.element).find('[data-container=main]').html(null);
                    module.load('section', {section: self.sections[$(this).data('index')]});

                });
            });
        });
    };

    this.initiateMenu = function(){

        self.view.render('layout/view/menu', {sections: self.sections}, function(menu){

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

                $(self.element).find('[data-container-menu] .menu').removeClass('open');
                $(self.element).find('[data-container-menu] .menu-backdrop').removeClass('open');

                $(self.element).find('[data-container=main]').html(null);
                module.load('section', {section: self.sections[$(this).data('index')]});

                setTimeout(function () {
                    $(self.element).find('[data-container-menu] .menu-backdrop').hide();

                }, 150)

            });
        });
    };

    var self = this;
};