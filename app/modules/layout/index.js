modules.layout = function(){

    this.style = null;
    this.interval = null;

    this.sections = null;
    this.menuExists = false;

    this.init = function () {

        services.api.getSections(null, function(sections){

            self.sections = sections.sections;

            self.view.render('layout/view/index', sections, function(tpl){

                $(self.element).html(tpl);

                services.shoppingCart.setShoppingCartCallback(self.shoppingCartUpdated);
                self.shoppingCartUpdated();

                self.updateStyles();
                self.showUi();

                $(self.element).on('click', '[data-section]', function(){

                    self.initiateMenu();

                    var index = $(this).data('index');

                    setTimeout(function(){
                        self.loadSubSection(self.sections[index]);
                    }, 1);
                });
            });
        });

        self.interval = setInterval(self.updateStyles, 20000);
    };

    this.showUi = function(){
        $(self.element).find('[data-section]').transition({opacity: 1});
        $(self.element).find('[data-company]').transition({opacity: 1});
    };

    this.updateStyles = function(){

        services.api.getStyles(function(styles){

            self.style = styles.style;

            self.view.render('layout/view/styles', self.style, function(tpl){
                $(self.element).find('[data-styles]').html(tpl);
            });

            $(self.element).find('[data-slogan]').html(self.style.company.slogan);
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
        var $menuBackdrop = $(self.element).find('[data-container-menu] .menu-backdrop');

        $(self.element).on('click', '[data-menu-open]', function(){

            $menuBackdrop.show();
            $menuBackdrop.transition({opacity: 0.6});

            $menu.transition({left:"0px"});
        });

        $(self.element).on('click', '[data-menu-close]', function(){
            $menu.transition({left:"-300px"});
            $menuBackdrop.animate({opacity: 0}, config.animation.duration, function(){
                $(this).hide();
            });
        });

        $(self.element).on('click', '[data-main-section]', function(){

            $menu.transition({left:"-300px"});
            $menuBackdrop.animate({opacity: 0}, config.animation.duration, function(){
                $(this).hide();
            });

            var index = $(this).data('index');

            setTimeout(function(){
                self.loadSubSection(self.sections[index]);
            }, 1);
        });
    };

    this.shoppingCartUpdated = function(orders){

        orders = orders || {
            orders: [],
            price: 0,
            amount: 0
        };

        self.view.render('layout/view/cart', orders, function(tpl){
            $(self.element).find('[data-cart-holder]').html(tpl);
        });
    };

    this.loadSubSection = function(section){

        $(self.element).find('[data-section]').transition({opacity: 0, y: 200});
        $(self.element).find('[data-company]').transition({opacity: 0, y: -200});

        $(self.element).find('[data-section-header]').transition({opacity: 0, y: -200});
        $(self.element).find('[data-sub-section]').transition({opacity: 0, y: 200});

        $(self.element).find('[data-product-header]').transition({opacity: 0, y: -200});
        $(self.element).find('[data-product]').transition({opacity: 0, y: 200});

        setTimeout(function(){

            module.unload('section');
            module.unload('product');

            if (section.productsCount) {
                module.load('product', {section: section});
            }
            else {
                module.load('section', {section: section}, $(self.element).find('[data-container=main]'), true);
            }
        }, config.animation.duration)
    };

    var self = this;
};