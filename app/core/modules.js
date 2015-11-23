window.module = function () {

    this.init = function() {

        $(document).listen('insert', '[data-module]', function(element) {

            if ($(element).data('loaded')) {
                return false;
            }

            self.load($(element).data('module'), null, element);
        });
    };

    this.load = function (name, params, element) {

        if (!element) {
            var container = $('body');
            if ($('[data-container=main]').size()) {
                container = $('[data-container=main]');
            }
            container.prepend('<div data-loaded="true" data-module="' + name + '"></div>');
            element = $('[data-module=' + name + ']').get();
        }

        if (!modules[name]) {
            module.unloadAll('layout');
            module.load('404');
            return;
        }

        if (typeof modules[name] == 'function') {
            modules[name] = new modules[name]();
        }

        if (modules[name].loaded) {
            return;
        }

        modules[name].prototype = modules['base'];
        modules[name].element = element;
        modules[name].view = view();
        modules[name].view.basePath = ['app', 'modules'].join('/');
        modules[name].params = params?params:{};
        modules[name].init();

        modules[name].loaded = true;
        $(element).data('loaded', true);
    };

    this.unload = function (name) {

        if (!modules[name]) {
            console.log('Trying to unload undefined module:', name);
            return false;
        }

        if (modules[name].unload && modules[name].loaded) {
            modules[name].unload();
        }

        $('[data-module=' + name + ']').remove();
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