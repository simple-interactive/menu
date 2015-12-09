$(function () {
    window.view.plugins.message = function (caption, content, buttons, style, callback) {

        if (!style) {
            style = "info";
        }

        var data = {
            caption: caption,
            content: content,
            style: style,
            buttons: []
        };

        for (var i = 0; i < Object.keys(buttons).length; i++) {
            data.buttons.push({
                'title': Object.keys(buttons)[i],
                'style': buttons[Object.keys(buttons)[i]]
            });
        }

        $('body').append(view().render('view/plugins/message/message', data));
        $('#plugin-message').modal();
        $('#plugin-message').on('hidden.bs.modal', function () {
            $('#plugin-message').remove();

            if (callback) {
                callback();
            }
        });
    };
});