$(function () {
    window.view.plugins.partial = function (template, data) {
        return view().render(template, data);
    };
});