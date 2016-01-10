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

        services.api.pairCheck(config.token,
            function(){
                dispatcher.initApp(config.token);
            },
            function(){
                module.load('token', {callback: dispatcher.initApp});
            }
        );
    };
});
