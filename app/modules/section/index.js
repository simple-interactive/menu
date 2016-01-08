modules.section = function(){

    this.section = null;
    this.sections = null;

    this.eventType = 'touchstart';

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

    this.showUi = function(){
        $(self.element).find('[data-sub-section]').transition({opacity: 1});
        $(self.element).find('[data-section-header]').transition({opacity: 1});
    };

    this.drawMenu = function(){

        var temparray = [];

        var swiperOptions = {
            direction: 'vertical',
            loop: false,
            spaceBetween: 50
        };

        var i,j,chunk = 8;
        for (i=0,j=self.sections.length; i<j; i+=chunk) {
            temparray.push(self.sections.slice(i,i+chunk));
        }

        if (temparray.length > 1) {
            swiperOptions.pagination = '.swiper-pagination';
        }

        if (self.sections.length > 8) {
            self.eventType = 'click';
        }

        self.view.render('section/view/index', {sections: temparray, section: self.section}, function(renderedHtml){

            $(self.element).html(renderedHtml);
            new Swiper ($(self.element).find('.swiper-container'), swiperOptions);

            self.showUi();
        });

        $(self.element).on(self.eventType, '[data-sub-section]', function(){

            $(self.element).find('[data-section-header]').transition({opacity: 0, y: -200});
            $(self.element).find('[data-sub-section]').transition({opacity: 0, y: 200});

            var index = $(this).data('index');

            setTimeout(function(){

                self.section = self.sections[index];

                if (!self.section.productsCount) {
                    self.reloadSections();
                }
                else {
                    var section = self.section;
                    module.unload('section');
                    module.load('product', {section: section});
                }

            }, config.animation.duration);

        });
    };

    this.unload = function(){

        delete self.section;
        delete self.sections;

        delete self.eventType;

        $(self.element).remove();
    };

    var self = this;
};