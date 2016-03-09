modules.layout = function(){

    this.style = null;

    this.interval = null;

    this.sections = null;
    this.menuExists = false;

    this.eventType = 'click';

    this.init = function () {

        services.api.getSections(null, function(sections){

            self.sections = sections.sections;

            if (self.sections.length > 8) {
                self.eventType = 'click';
            }

            self.view.render('layout/view/index', {}, function(tpl){

                $(self.element).html(tpl);

                self.shoppingCartUpdated();
                self.updateStyles(function(){
                    self.showMain();
                });

                $(self.element).on(self.eventType, '[data-section]', function(){

                    self.initiateMenu();

                    var index = $(this).data('index');

                    setTimeout(function(){
                        self.loadSubSection(self.sections[index]);
                    }, 1);
                });

                $(self.element).on('touchstart', '[data-cart]', function(){
                    if (services.shoppingCart.getAmount()) {
                        module.load('cart', {callback: self.finished});
                    }
                });

                $(self.element).on('touchstart', '[data-call-waiter]', function(){

                    services.api.callWaiter(function(){
                        self.view.render('layout/view/call-waiter', {}, function(tpl){
                            $('body').prepend(tpl);

                            $('[data-call-waiter].modal')
                                .modal({backdrop: 'static'})
                                .on('hidden.bs.modal', function(){
                                    $('[data-call-waiter].modal').remove();
                                });

                        });
                    });
                });
            });
        });

        if (self.interval) {
            clearInterval(self.interval);
        }
        self.interval = setInterval(self.updateStyles, config.style.updatePeriod);
    };

    this.showMain = function(){

        $('.footer').transition({x:0});

        self.view.render('layout/view/main', {sections: self.sections, style: self.style}, function(tpl){
            $(self.element).find('[data-container]').html(tpl);

            self.showUi();
        });
    };

    this.showUi = function(){
        $(self.element).find('[data-section]').transition({opacity: 1});
        $(self.element).find('[data-company]').transition({opacity: 1});
    };

    this.updateStyles = function(callback){

        services.api.getStyles(function(styles){

            self.style = styles.style;

            if (callback) {
                callback(styles);
            }

            self.view.render('layout/view/styles', self.style, function(tpl){
                $(self.element).find('[data-styles]').html(tpl);
            });

            $(self.element).find('[data-slogan]').html(self.style.company.slogan);
        });
    };

    this.initiateMenu = function(){

        self.view.render('layout/view/menu', {sections: self.sections, style: self.style}, function(menu){
            $(self.element).find('[data-container-menu]').html(menu);
            $(self.element).find('[data-container-menu] .menu').transition({x:0});

            $(self.element).find('[data-menu-logo]').unbind('touchstart').bind('touchstart', function() {

                $(self.element).find('[data-container-menu] .menu').transition({x:-200});

                $(self.element).find('[data-section]').transition({opacity: 0, y: 200});
                $(self.element).find('[data-company]').transition({opacity: 0, y: -200});

                $(self.element).find('[data-section-header]').transition({opacity: 0, y: -200});
                $(self.element).find('[data-sub-section]').transition({opacity: 0, y: 200});

                $(self.element).find('[data-product-header]').transition({opacity: 0, y: -200});
                $(self.element).find('[data-product]').transition({opacity: 0, y: 200});

                setTimeout(self.showMain, config.animation.duration);
            });
        });

        $(self.element).on(self.eventType, '[data-main-section]', function(){
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

        $('.footer').transition({x:100});

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

        if (result) {
            services.shoppingCart.clear();
            self.shoppingCartUpdated();
        }

        self.view.render('layout/view/thanks', {result: result}, function(tpl){

            $('body').prepend(tpl);

            $('[data-cart-thanks]')
                .modal({backdrop: 'static'})
                .on('hidden.bs.modal', function(){
                    $('[data-cart-thanks]').remove();
                });

        });
    };

    this.showMessage = function(header, message){

        self.view.render('layout/view/message', {header: header, message: message}, function(tpl){

            $('body').prepend(tpl);

            $('[data-modal-message]')
                .modal({backdrop: 'static'})
                .on('hidden.bs.modal', function(){
                    $('[data-modal-message]').remove();
                });

        });
    };

    this.unload = function(){

        if ($('[data-cart-thanks]').size()) {
            $('[data-cart-thanks]').modal('hide');
        }

        if ($('[data-call-waiter].modal').size()) {
            $('[data-call-waiter].modal').modal('hide');
        }

        services.shoppingCart.clear();

        clearInterval(self.interval);

        delete self.style;
        delete self.interval;

        delete self.sections;
        delete self.menuExists;

        delete self.eventType;

        $(self.element).remove();
        $('.modal-backdrop').remove();
    };

    var self = this;
};