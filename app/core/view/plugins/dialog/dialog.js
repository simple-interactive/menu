$(function () {
    /**
     *
     * @param {String} caption
     * @param {String} content
     *
     * @param {Array} callbacks
     * @param {String} callbacks.title
     * @param {String} callbacks.style
     * @param {Function} callbacks.callback
     *
     * @param {String} style [style=info]
     */
    window.view.plugins.dialog = function (caption, content, callbacks, style) {

        if (!style) {
            style = "info";
        }

        var data = {
            caption: caption,
            content: content,
            style: style,
            callbacks: callbacks
        };

        $('body').append(view().render('view/plugins/dialog/dialog', data));
        $('#plugin-confirm').modal();
        $('#plugin-confirm').on('hidden.bs.modal', function () {
            $('#plugin-confirm').remove();
            $('.modal-backdrop').remove();
        });

        $('#plugin-confirm [data-click]').click(function () {

            $('#plugin-confirm').modal('hide');

            if (callbacks[$(this).data('click')].callback) {
                callbacks[$(this).data('click')].callback();
            }
        });
    };
});