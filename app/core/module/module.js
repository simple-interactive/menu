window.module = function () {

    this.processElement = function (element) {
        if (!$(element).data('processed')) {
            $(element).data('processed', true);
            if ($(element).data('loaded')) {
                return false;
            }
            self.load($(element).data('module'), null, element);
        }
    };

    this.init = function() {

        var required = '[data-module]';

        $(document).bind('DOMNodeInserted', function(e) {
            if ($(e.target).is(required)) {
                self.processElement(e.target);
            }
            $(e.target).find(required).each(function(){
                self.processElement(this);
            });
        });

        if ($(required).size()) {
            self.processElement($(required).get());
        }
    };

    this.load = function (name, params, element, fill) {

        var container = null;

        if (!element) {

            container = $('body');

            if ($('[data-container=main]').size()) {
                container = $('[data-container=main]');
            }
        }
        else {
            container = $(element);
        }

        if (fill) {
            container.html('<div data-loaded="true" data-module="' + name + '"></div>');
        } else {
            container.prepend('<div data-loaded="true" data-module="' + name + '"></div>');
        }
        element = $('[data-module=' + name + ']').get();

        if (!modules[name]) {
            console.log("Trying to load undefined module: '" + name + "'");
            return false;
        }

        if (typeof modules[name] == 'function') {
            modules[name] = new modules[name]();
        } else {
            modules[name].constructor();
        }

        try {
            modules[name].element = element;
            modules[name].view = view();
            modules[name].view.basePath = ['app', 'modules'].join('/');
            modules[name].params = $.extend(true, {}, params)?params:{};
            modules[name].init();

            modules[name].loaded = true;
            $(element).data('loaded', true);
        }
        catch (e) {
            console.log('Module loading error', e);
        }
    };

    this.unload = function (name) {

        if (!modules[name]) {
            console.log('Trying to unload undefined module:', name);
            return false;
        }

        if (modules[name].unload && modules[name].loaded) {
            modules[name].unload(function () {
                modules[name].loaded = false;
            });
        }
        else {
            modules[name].loaded = false;
            $('[data-module=' + name + ']').remove();
        }
    };

    this.unloadAll = function (except) {
        for (var module in modules) {
            if (module != except && modules[module].loaded) {
                window.module.unload(module);
            }
        }
    };

    this.isExists = function (name) {
        return !(!modules[name]);
    };

    var self = this;
};