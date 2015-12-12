window.services.api = function(){

    /**
     * @type {{endpoint: (config.endpoint|string)}}
     */
    this.config = {
        endpoint : config.endpoint,
        token: config.token
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


   this.getStyles = function(callback){
       callback({
           styles : {
               brand: 'rgba(196, 8, 31, 0.7)',
               foreground: 'black',
               background: 'white'
           },
           background: {
               url: "http://interestingukraine.kiev.ua/wp-content/uploads/2013/11/restoran-sutra.jpg"
           }
       });
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
                    services.user.forget();
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