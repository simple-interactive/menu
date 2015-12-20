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

        self.view.render('section/view/index', {sections: temparray, section: self.section}, function(renderedHtml){

            $(self.element).html(renderedHtml);
            new Swiper ($(self.element).find('.swiper-container'), swiperOptions);
        });

        $(self.element).on('click', '[data-section]', function(){

            self.section = self.sections[$(this).data('index')];

            if (!self.section.productsCount) {
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