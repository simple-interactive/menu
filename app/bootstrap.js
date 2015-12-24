$(function(){
    dispatcher.postDispatch = function () {

        this.initApp = function (token) {

            config.token = token;
            storage.setItem('token', token);

            services.ui.init();
            module.load('layout');
        };

        config.token = storage.getItem('token');

        services.api.pairCheck(config.token,
            function(){
                self.initApp(config.token);
            },
            function(){
                module.load('token', {callback: self.initApp});
            }
        );

        var self = this;
    };
});