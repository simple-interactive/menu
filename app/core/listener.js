(function($) {

    var listeningEvents = {
        'insert': function (required, callback) {

            if (!callback) return;

            function processElement(element){
                if (!$(element).data('processed')) {
                    $(element).data('processed', true);
                    callback(element);
                }
            }
            $(document).bind('DOMNodeInserted', function(e) {
                if ($(e.target).is(required)) {
                    processElement(e.target);
                }
                $(e.target).find(required).each(function(){
                    processElement(this);
                });
            });
            if ($(required).size()) {
                processElement($(required).get());
            }
        }
    };

    $.fn.listen = function (event, required, callback) {
        listeningEvents[event](required, callback);
    };

})(jQuery);