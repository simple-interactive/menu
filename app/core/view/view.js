window.view = function() {

    return new (function(){

        var self = this;

        this.render = function(template, data, callback) {

            if (!view.templates[template]) {
                console.log('Trying to render undefined template:', template);
                return false;
            }

            var templateCode = "var p=[],print=function(){p.push.apply(p,arguments);};" +
                "with(obj){p.push('" +
                view.templates[template]
                    .replace(/[\r\t\n]/g, " ")
                    .split("<%").join("\t")
                    .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                    .replace(/\t=(.*?)%>/g, "',$1,'")
                    .split("\t").join("');")
                    .split("%>").join("p.push('")
                    .split("\r").join("\\'")
                + "');} return p.join('');";


            if (!data) {
                data = {};
            }

            data.plugins = window.view.plugins;

            if (!callback) {
                return (new Function("obj", templateCode))(data);
            }

            callback((new Function("obj", templateCode))(data));
        };

    })();
};

window.view.plugins = {};
window.view.helpers = {};
window.view.templates = {};

$(function(){

    if (Object.keys(window.view.templates).length == 0) {

        templatesCount = $('[data-view]').size();

        $('[data-view]').each(function () {
            (function (view) {
                $.get($(view).data('src'), function(template){
                    window.view.templates[$(view).data('view')] = template;
                    if (Object.keys(window.view.templates).length == templatesCount) {
                        dispatcher.dispatch();
                    }
                });
            })(this);
        });
    }
    else {
        dispatcher.dispatch();
    }
});