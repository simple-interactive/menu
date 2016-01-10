window.storage = new (function () {

    this.setAdapter = function (adapter) {
        self.adapter = adapter;
    };

    this.setItem = function (key, value) {
        return self.adapter.setItem(key, Base64.encode(JSON.stringify(value)));
    };

    this.getItem = function (key) {
        var value = self.adapter.getItem(key);
        if (value) {
            try {
                return JSON.parse(Base64.decode(value));
            }
            catch(e){
                return null;
            }
        }
        return value;
    };

    this.removeItem = function (key) {
        return self.adapter.removeItem(key);
    };

    this.clear = function () {
        return self.adapter.clear();
    };

    this.adapter = localStorage;

    this.test = function () {

        try {
            self.adapter.setItem('testing', 'testing');
            self.adapter.removeItem('testing');

            return true;
        }
        catch (e) {}

        return false;
    };

    var self = this;

    if (isApp) {
        this.adapter = cordovaStorage;
    }
    else if (!this.test()) {
        this.adapter = cookie;
    }

})();