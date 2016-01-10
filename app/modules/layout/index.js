modules.layout = function(){

    this.style = null;
    this.interval = null;

    this.sections = null;
    this.menuExists = false;

    this.eventType = 'touchstart';

    this.init = function () {

        services.api.getSections(null, function(sections){

            self.sections = sections.sections;

            if (self.sections.length > 8) {
                self.eventType = 'click';
            }

            self.view.render('layout/view/index', sections, function(tpl){

                $(self.element).html(tpl);

                self.shoppingCartUpdated();
                self.updateStyles();
                self.showUi();

                $(self.element).on('touchstart', '[data-cart]', function(){
                    if (services.shoppingCart.getAmount()) {
                        module.load('cart', {callback: self.finished});
                    }
                });

                $(self.element).on(self.eventType, '[data-section]', function(){

                    self.initiateMenu();

                    var index = $(this).data('index');

                    setTimeout(function(){
                        self.loadSubSection(self.sections[index]);
                    }, 1);
                });
            });
        });

        self.interval = setInterval(self.updateStyles, config.style.updatePeriod);
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

        $(self.element).on('touchstart', '[data-menu-open]', function(){

            $menuBackdrop.show();
            $menuBackdrop.transition({opacity: 0.6});

            $menu.transition({x:0});
        });

        $(self.element).on('touchstart', '[data-menu-close]', function(){

            $menu.transition({x:-300});
            $menuBackdrop.transition({opacity: 0});

            setTimeout(function(){
                $menuBackdrop.hide();
            }, config.animation.duration);
        });

        $(self.element).on(self.eventType, '[data-main-section]', function(){

            $menu.transition({x:-300});
            $menuBackdrop.transition({opacity: 0});

            setTimeout(function(){
                $menuBackdrop.hide();
            }, config.animation.duration);

            self.loadSubSection(self.sections[$(this).data('index')]);
        });
    };

    this.shoppingCartUpdated = function(){

        var orders = {
            list: services.shoppingCart.getOrders(),
            price: services.shoppingCart.getTotalPrice(),
            amount: services.shoppingCart.getAmount()
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
                module.load('product', {section: section}, $(self.element).find('[data-container=main]'), true);
            }
            else {
                module.load('section', {section: section}, $(self.element).find('[data-container=main]'), true);
            }
        }, config.animation.duration)
    };

    this.finished = function(result){

        services.shoppingCart.clear();
        self.shoppingCartUpdated();

        self.view.render('layout/view/thanks', {result: result}, function(tpl){

            $('body').prepend(tpl);

            $('[data-cart-thanks]')
                .modal({backdrop: 'static'})
                .on('hidden.bs.modal', function(){
                    $('[data-cart-thanks]').remove();
                });

        });
    };

    var self = this;
};