$(function(){
    dispatcher.postDispatch = function () {
        services.ui.init();
        module.load('layout');
    };
});