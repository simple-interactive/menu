window.modules = {};
window.services = {};

window.bootstrap = new (function () {

    this.run = function () {

        module = new module();
        module.init();

        for (var service in services) {
            services[service] = new services[service]();
        }

        module.load('layout');
    };

})();