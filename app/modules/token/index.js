modules.token = function (){

    this.token = null;

    this.init = function(){

        self.view.render('token/view/index', {}, function(tpl){
            $(self.element).html(tpl);

            $(self.element).find('.modal')
                .modal({backdrop: false})
                .on('hidden.bs.modal', function(){
                    self.unload();
                });

            $(self.element).find('[data-token]').on('change', function(){
                self.token = $(this).val();
            });

            $(self.element).find('[data-connect]').on('touchstart', function(){

                var $submit = $(this);
                $inputs = $(self.element).find('input');

                $submit.attr('disabled', 'disabled').addClass('loading');
                $inputs.attr('disabled', 'disabled');
                $inputs.removeClass('animated').removeClass('shake');

                services.api.pair(
                    self.token,
                    function(response){
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

        if (self.params.callback) {
            self.params.callback(self.token);
        }

        delete self.token;
        $(self.element).remove();
    };

    var self = this;
};