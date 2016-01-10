modules.token = function (){

    this.init = function(){

        self.view.render('token/view/index', {}, function(tpl){

            $(self.element).html(tpl);

            $(self.element).find('.modal')
                .modal({backdrop: false})
                .on('hidden.bs.modal', function(){
                    self.unload();
                });

            $(self.element).find('[data-connect]').on('touchstart', function(){

                if (config.isApp && StatusBar && StatusBar.hide) {
                    StatusBar.hide();
                }

                var $submit = $(this);
                var $inputs = $(self.element).find('input');
                var token = $(self.element).find('[data-token]').val();

                $submit.attr('disabled', 'disabled').addClass('loading');
                $inputs.attr('disabled', 'disabled');
                $inputs.removeClass('animated').removeClass('shake');

                services.api.pair(
                    token,
                    function(response){
                        if (self.params.callback) {
                            self.params.callback(token);
                        }
                        $(self.element).find('.modal').modal('hide');
                    },
                    function(response){

                        $submit.removeAttr('disabled').removeClass('loading');
                        $inputs.removeAttr('disabled');

                        $inputs.addClass('animated shake');
                    }
                );
            });
        });
    };

    this.unload = function(){
        $(self.element).remove();
    };

    var self = this;
};