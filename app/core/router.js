window.router = new (function () {

    this.routes = {
        'certificate': {
            route: 'r/:code',
            defaults: {
                type: 'string'
            }
        }
    };

    this.lastRoute = null;

    this.start = function () {

        var scheduler = function () {
            if (location.pathname != self.lastRoute) {
                self.lastRoute = location.pathname;
                self.loadModule(self.lastRoute);
            }
        };

        setInterval(scheduler, 100);
        scheduler();

        $('body').on('click', '[data-route]', function(){

            self.go($(this).data('href'));
            return false;
        });
    };

    this.loadModule = function (url) {

        var url = $.grep(url.split('/'), function(n){
            return (n);
        });

        var matchModule = null;
        var params = {};

        for (var module in self.routes) {

            var routeComponents = self.routes[module].route.split('/');

            var vars = 0, static = 0, match = 0, potentialParams = {};

            for (var i = 0; i < routeComponents.length; i ++) {

                if (routeComponents[i][0] == ':') {
                    potentialParams[routeComponents[i].substr(1)] = url[i];
                    vars++;
                } else {
                    static++;

                    if (url[i] == routeComponents[i]) {
                        match++;
                    }
                }
            }

            if (match == static) {
                matchModule = module;
                params = potentialParams;
            }
        }

        if (!matchModule) {

            if (!url.length) {
                matchModule = 'index';
            }
            else {
                matchModule = url[0];

                for (var i = 1; i < url.length; i+=2) {
                    if (url[i+1]) {
                        params[url[i]] = url[i+1];
                    }
                }
            }
        }

        window.module.unloadAll('layout');

        if (window.module.isExists(matchModule)) {

            if (self.routes[matchModule] && self.routes[matchModule].defaults) {
                for (var defaults in self.routes[matchModule].defaults) {
                    if (!params[defaults]) {
                        params[defaults] = self.routes[matchModule].defaults[defaults];
                    }
                }
            }

            window.module.load(matchModule, params);
        } else {
            window.module.load('404');
        }
    };

    this.go = function (url) {
        if (location.pathname == url) {
            self.loadModule(url);
        }
        history.pushState({}, null, url);
    };

    this.set = function (url) {
        self.lastRoute = url;
        history.pushState({}, null, url);
    };

    var self = this;

})();