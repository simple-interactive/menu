modules.layout = function(){

    this.sections = null;
    this.menuExists = false;

    this.init = function () {

        services.api.getSections(null, function(sections){

            self.sections = sections.sections;

            self.view.render('layout/view/index', sections, function(tpl){

                $(self.element).html(tpl);

                $(self.element).on('click', '[data-section]', function(){

                    self.initiateMenu();

                    var index = $(this).data('index');

                    setTimeout(function(){
                        self.loadSubSection(self.sections[index]);
                    }, 1);
                });
            });
        });
    };

    this.initiateMenu = function(){

        if (self.menuExists) {
            return;
        }

        self.view.render('layout/view/menu', {sections: self.sections}, function(menu){
            $(self.element).find('[data-container-menu]').html(menu);
            self.menuExists = true;
        });

        var $menu = $(self.element).find('[data-container-menu] .menu');

        $(self.element).on('click', '[data-menu-open]', function(){
            $menu.transition({left:"0px"});
        });

        $(self.element).on('click', '[data-menu-close]', function(){
            $menu.transition({left:"-300px"});
        });

        $(self.element).on('click', '[data-main-section]', function(){

            $menu.transition({left:"-300px"});

            var index = $(this).data('index');

            setTimeout(function(){
                self.loadSubSection(self.sections[index]);
            }, 1);
        });
    };

    this.loadSubSection = function(section){

        module.unload('section');
        module.unload('product');

        if (section.productsCount) {
            module.load('product', {section: section});
        }
        else {
            module.load('section', {section: section}, $(self.element).find('[data-container=main]'), true);
        }
    };

    var self = this;
};