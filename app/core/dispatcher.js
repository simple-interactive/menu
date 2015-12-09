window.modules = {};
window.services = {};

window.dispatcher = new (function () {

    this.dispatch = function () {

        self.preDispatch();

        window.module = new window.module();
        window.module.init();

        for (var service in window.services) {
            window.services[service] = new window.services[service]();
        }

        self.postDispatch();
    };

    this.preDispatch = function () {};
    this.postDispatch = function () {};

    var self = this;

})();