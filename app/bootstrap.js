$(function(){

    dispatcher.postDispatch = function () {

        this.initApp = function (token) {

            config.token = token;
            storage.setItem('token', config.token);
            services.api.config.token = config.token;

            module.load('layout');
        };

        this.initApp('cdd8c72ac04bc21d79827d263ceee153');
/*
        services.ui.init();

        config.token = storage.getItem('token');

        services.api.pairCheck(config.token,
            function(){
                self.initApp(config.token);
            },
            function(){
                module.load('token', {callback: self.initApp});
            }
        );
        */

        var self = this;
    };
});