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

            $(self.element).find('[data-config]').on('change', function(){
                self.config[$(this).data('config')] = $(this).val();
            });

            $(self.element).find('[data-connect]').on('click', function(){

                var $submit = $(this);
                var $inputs = $(self.element).find('input');

                $submit.attr('disabled', 'disabled').addClass('loading');
                $inputs.attr('disabled', 'disabled');

                services.api.pair(
                    self.token,
                    function(response){
                        $(self.element).find('.modal').modal('hide');
                    },
                    function(response){
                        $submit.removeAttr('disabled').removeClass('loading');
                        $inputs.removeAttr('disabled');
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