window.services.loader = function(){

    this.loaderTemplate = '<div class="modal-backdrop loader"></div>';

    this.show = function(){
        if (!$('body>.loader').size()) {
            $('body').append(self.loaderTemplate);
        }
        $('body>.loader').fadeIn();
    };

    this.hide = function(){
        $('body>.loader').fadeOut('slow', function(){
            $(this).remove();
        });
    };

    var self = this;

};