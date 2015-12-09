window.services.ui = function(){

    this.init = function () {
        this.initiateAnimated();
    };


    this.initiateAnimated = function(){

        (function($) {

            $.fn.animate = function (type) {

                this.removeClass(type);
                var self = this;

                setTimeout(function () {
                    self.addClass('animated');
                    self.addClass(type);
                }, 1);
            };

        })(jQuery);
    };
};