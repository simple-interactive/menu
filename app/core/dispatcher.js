modules = {};
services = {};

dispatcher = new (function () {

    this.dispatch = function () {

        this.preDispatch();

        module = new module();
        module.init();

        self.moduleLoaded();

        for (var service in services) {
            services[service] = new services[service]();
        }

        self.postDispatch();
    };

    this.preDispatch = function () {};
    this.moduleLoaded = function () {};
    this.postDispatch = function () {};

    var self = this;

})();