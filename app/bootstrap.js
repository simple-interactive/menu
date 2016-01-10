$(function(){

    dispatcher.initApp = function (token) {

        config.token = token;
        storage.setItem('token', config.token);
        services.api.config.token = config.token;

        module.load('layout');
    };

    dispatcher.postDispatch = function () {

        services.ui.init();

        config.token = storage.getItem('token');

        if (config.token) {
            services.api.pairCheck(config.token,
                function(){
                    dispatcher.initApp(config.token);
                },
                function(){
                    storage.removeItem('token');
                    module.load('token', {callback: dispatcher.initApp});
                }
            );
        } else {
            module.load('token', {callback: dispatcher.initApp});
        }
    };
});
