window.cookie = new (function () {

    this.setItem = function (key, value) {

        var date = new Date();
        date.setTime(date.getTime() + (9999*24*60*60*1000));
        document.cookie = key + "=" + value + "; " + "expires=" + date.toUTCString();
    };

    this.getItem = function (key) {

        var name = key + "=";
        var cookies = document.cookie.split(';');

        for(var i = 0; i < cookies.length; i++) {

            var cookie = cookies[i];

            while (cookie.charAt(0)==' ') {
                cookie = cookie.substring(1);
            }

            if (cookie.indexOf(name) == 0) {
                return cookie.substring(name.length,cookie.length);
            }
        }

        return undefined;
    };

    this.removeItem = function (key) {

        var date = new Date();
        date.setTime(date.getTime() - 1);
        document.cookie = key + "=; " + "expires=" + date.toUTCString();
    };

    this.clear = function () {

        var cookies = document.cookie.split(";");

        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var eqPos = cookie.indexOf("=");
            var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
    };
})();