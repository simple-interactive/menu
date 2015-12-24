modules.stylize = function(){

    this.style = null;
    this.interval = null;

    this.init = function () {

        self.interval = setInterval(self.updateStyles, 20000);
        self.updateStyles();
    };

    this.updateStyles = function(){

        services.api.getStyles(function(styles){
            self.style = styles.style;
            self.updateDocument();
        });
    };

    this.updateDocument = function(){

        self.view.render('stylize/view/index', self.style, function(renderedHtml){
            $(self.element).html(renderedHtml);
        });
    };

    var self = this;
};