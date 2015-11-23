$(function () {
    window.view.plugins.date = function (format, timestamp) {

        var date = new Date(timestamp*1000);

        var values = {
            '{yyyy}' : date.getFullYear(),
            '{yy}'   : date.getFullYear().toString().substr(2),
            '{mm}'   : (date.getMonth() < 10)?"0"+date.getMonth():date.getMonth(),
            '{m}'    : date.getMonth(),
            '{dd}'   : (date.getDate() < 10 )?"0"+date.getDate():date.getDate(),
            '{d}'    : date.getDay(),
            '{hh}'   : (date.getHours() < 10 )?"0"+date.getHours():date.getHours(),
            '{h}'    : date.getHours(),
            '{mins}' : (date.getMinutes() < 10 )?"0"+date.getMinutes():date.getMinutes(),
            '{min}'  : date.getMinutes(),
            '{ss}'   : (date.getSeconds() < 10 )?"0"+date.getSeconds():date.getSeconds(),
            '{s}'    : date.getSeconds()
        };

        for (var value in values) {
            format = format.split(value).join(values[value]);
        }

        return format;
    };
});