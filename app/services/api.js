window.services.api = function(){

    this.config = {
        endpoint : config.endpoint
    };

    this.token = null;
    this.company = null;
    this.address = null;

    this.setToken = function (token) {
        self.token = token;
    };

    this.setCompany = function (company) {
        self.company = company;
    };

    this.setAddress = function (address) {
        self.address = address;
    };

    this.login = function(data, callback){

        if (!self.config.endpoint) {
            console.log("API Endpoint was not specified");
            return;
        }

        $.post([self.config.endpoint, 'account'].join('/'), data, callback);
    };

    this.getCertificateByDigitNumber = function(number, callback){
        self.call('certificate', {id: number, code: 'numeric'}, callback);
    };

    this.getCertificateByString = function(string, callback){
        self.call('certificate', {id: string, code: 'string'}, callback);
    };

    this.useCertificate = function (certificate, product, callback) {
        self.call(
            'certificate/use',
            {certificate: certificate, product: product},
            callback
        );
    };

    this.getHistory = function (status, start, count, callback) {
        self.call('history', {
            status: status,
            start: start,
            count: count
        }, callback);
    };

    this.call = function(method, data, callback){

        if (!self.config.endpoint) {
            console.log("API Endpoint was not specified");
            return;
        }

        $.ajax({
            url: [self.config.endpoint, method].join('/'),
            data: data,
            type: "GET",
            dataType: 'json',
            beforeSend: function(request){
                request.setRequestHeader('x-auth', self.token);
            },
            complete: function (response) {

                var parsedResponse = {
                    success: false,
                    message: 'Сервер времено не отвечает'
                };

                try {
                    parsedResponse = JSON.parse(response.responseText);
                } catch (err) {}

                callback(parsedResponse);
            }
        });
    };

    var self = this;

};