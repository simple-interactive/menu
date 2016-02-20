window.services.liqPay = function(){

    var self = this;

    this.publicKey = null;
    this.privateKey = null;

    this.data = {
        version: 3,
        action: 'pay',
        currency: 'UAH'
    };

    this.initiatePayment = function (amount, description, successCallback, failCallback) {

        if (!self.publicKey || !self.privateKey) {
            modules.layout.showMessage(
                'Ошибка!',
                'Нет данных для оплаты по безналичному расчету.'
            );
            return;
        }

        if (!LiqPayCheckout) {
            modules.layout.showMessage(
                'Ошибка!',
                'Не згружен модуль терминала.'
            );
            return;
        }

        self.showLoader();

        var data = $.extend(true, {}, self.data);

        data.amount = amount;
        data.description = description;
        data.order_id = Date.now();
        data.public_key = self.publicKey;
        data.sandbox = 1;

        var orderId = data.order_id;

        data = Base64.encode(JSON.stringify(data));

        var sha = new jsSHA("SHA-1", "TEXT");
        sha.update(self.privateKey + data + self.privateKey);
        var signature = sha.getHash("B64");

        LiqPayCheckout.init({
            data: data,
            signature: signature,
            embedTo: "#liqpay_checkout",
            mode: "popup"
        }).on("liqpay.callback", function(data){

            if (data.result == 'success' && (data.status == 'wait_accept' || data.status == 'sandbox')) {

                if (successCallback) {
                    successCallback();
                }
            }
            else {
                if (failCallback) {
                    failCallback();
                }
            }

        }).on("liqpay.ready", function(data){
            self.hideLoader();
        }).on("liqpay.close", function(data){
            self.reLoadLiqpayContainer();
        });
    };

    this.reLoadLiqpayContainer = function(){
        $('#liqpay-container').remove();
        $('body').prepend('<div id="liqpay-container"><div id="liqpay_loader" class="liqpay_loader"><i class="fa fa-refresh fa-spin"></i></div><div id="liqpay_checkout"></div><script src="//static.liqpay.com/libjs/checkout.js" async></script></div>');
    };

    this.loadKeys = function(){
        services.api.getSettings(function(response){
            self.publicKey = response.publicKey;
            self.privateKey = response.privateKey;
        });
    };

    this.showLoader = function(){
        $('#liqpay_loader').show();
    };

    this.hideLoader = function(){
        $('#liqpay_loader').hide();
    };

    this.loadKeys();
    this.reLoadLiqpayContainer();
};