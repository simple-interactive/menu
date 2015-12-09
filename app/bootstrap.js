$(function(){
    window.dispatcher.postDispatch = function () {
        window.services.ui.init();
        module.load('layout');
        module.load('stylize', {}, 'body');
    };
});