window.cordovaStorage = new (function () {

    this.setItem = function (key, value) {
        localStorage[key] = value;
    };

    this.getItem = function (key) {
        return localStorage[key];
    };

    this.removeItem = function (key) {
        delete localStorage[key];
    };

    this.clear = function () {
        localStorage = [];
    };
})();