window.services.api = function(){

    this.cache = [];

    /**
     * @type {{endpoint: (config.endpoint|string)}}
     */
    this.config = {
        endpoint : config.endpoint,
        token: config.token
    };

    /**
     * Pairs tablet with md-backend
     *
     * @param {String} token
     * @param {Function} successCallback
     * @param {Function} failCallback
     */
    this.pair = function(token, successCallback, failCallback){

        $.ajax({
            url: [self.config.endpoint, 'pair'].join('/'),
            data: {token: token},
            type: 'post',
            complete: function (response) {

                try {
                    var parsedResponse = JSON.parse(response.responseText);
                } catch (err) {}

                if (response.status == 200) {
                    successCallback(parsedResponse);
                }
                else {
                    failCallback();
                }
            }
        });
    };

    /**
     *
     * @param {String} token
     * @param {Function} successCallback
     * @param {Function} failCallback
     */
    this.pairCheck = function(token, successCallback, failCallback){
        $.ajax({
            url: [self.config.endpoint, 'pair', 'check'].join('/'),
            data: {token: token},
            type: 'post',
            complete: function (response) {
                try {
                    var parsedResponse = JSON.parse(response.responseText);
                } catch (err) {}

                if (response.status == 200) {
                    successCallback(parsedResponse);
                }
                else {
                    failCallback();
                }
            }
        });
    };

    /****************************** SECTION *******************************/
    /**
     * Returns section list by provided parent section ID
     * METHOD: GET
     * URL:    section?parentId=parentId
     *
     * @param {string|null} parentId
     * @param {function} callback
     */
    this.getSections = function(parentId, callback){
        var params = (parentId != null)?{parentId: parentId}:{};
        self.call('get', 'section/list', params, callback);
    };

    /**
     * Returns section object by provided ID
     * Method: GET
     * URL:    section/get?id=sectionId
     *
     * @param {string}   sectionId
     * @param {function} callback
     */
    this.getSection = function(sectionId, callback){
        self.call('get', 'section', {id: sectionId}, callback);
    };

    /**************************** END SECTION *****************************/

    /**
     * Returns list of founded products
     *
     * @param {string} search
     * @param {number} limit
     * @param {number} offset
     * @param {function} callback
     */
    this.getSearchProducts = function(search, limit, offset, callback){
        self.call('get', 'product/search', {search: search, limit: limit, offset: offset}, callback);
    };

    /**
     * Returns list of products by section
     *
     * @param {string} sectionId
     * @param {number} limit
     * @param {number} offset
     * @param {function} callback
     */
    this.getSectionProducts = function(sectionId, limit, offset, callback){
        self.call('get', 'product/section', {sectionId: sectionId, limit: limit, offset: offset}, callback);
    };

    /**
     * Gets product data by id
     *
     * @param {String} id
     * @param {Function} callback
     */
    this.getProduct = function(id, callback){
        self.call('get', 'product', {id: id}, callback);
    };

    /**
     * Deletes product by id
     *
     * @param {String} id
     * @param {Function} callback
     */
    this.deleteProduct = function(id, callback){
        self.call('post', 'product/delete', {id: id}, callback);
    };

    /**************************** END PRODUCT *****************************/

    /**
     * Gets styles for menu
     *
     * @param {Function} callback
     */
    this.getStyles = function(callback){
        self.call('get', 'style', {_: Math.random()}, callback);
    };

    /**
     * @param {Object} order
     * @param {Function} successCallback
     * @param {Function} failureCallback
     */
    this.order = function(order, successCallback, failureCallback){
        self.call('post', 'order', {order: order}, successCallback, failureCallback);
    };

    /**
     * Send request to an api
     *
     * @param {string} method
     * @param {string} endpoint
     * @param {object} data
     * @param {function} callback
     * @param {function|null} [failCallback=null]
     */
    this.call = function(method, endpoint, data, callback, failCallback){

        if (!self.config.endpoint) {
            console.log("API Endpoint was not specified");
            return;
        }

        var cacheKey = endpoint+JSON.stringify(data);

        if (cacheData = self.cache[cacheKey]) {
            callback(cacheData);
            return;
        }

        $.ajax({
            url: [self.config.endpoint, endpoint].join('/'),
            data: data,
            type: method.toUpperCase(),
            dataType: 'json',
            beforeSend: function(request){
                request.setRequestHeader('x-auth', self.config.token);
            },
            complete: function (response) {

                if (response.status == 403) {
                    module.unloadAll();
                    module.load('token', {callback: dispatcher.initApp});
                    return false;
                }

                var parsedResponse = {
                    success: false,
                    message: 'the-server-is-currently-not-responding'
                };

                try {
                    parsedResponse = JSON.parse(response.responseText);
                } catch (err) {}

                if (response.status == 200) {
                    self.cache[cacheKey] = parsedResponse;
                    callback(parsedResponse);
                }
                else if (response.status == 400 && failCallback) {
                    failCallback(parsedResponse);
                }
                else if (failCallback) {
                    failCallback({
                        success: false,
                        message: 'the-server-is-currently-not-responding'
                    });
                }
            }
        });
    };

    var self = this;

};