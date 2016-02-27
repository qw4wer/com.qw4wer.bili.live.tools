/**
 * Created by qw4wer on 2016/2/25.
 */
/**
 * 将html文本转换为document树
 * @param str
 * @returns {Document}
 */
function createdDom(str) {
    var parser = new DOMParser();

    return parser.parseFromString(str);

}



/**
 * 占位符格式化字符串
 * @param str
 * @param arguments
 * @returns {*}
 */

function format(str, arguments) {
    for (var s = str, i = 0; i < arguments.length; i++)
        s = s.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
    return s;
}
// 页面方法 //
/**
 * 用于执行方法
 * @param fn
 * @param fnArg
 * @returns {*}
 */

function executeFn(fn, fnArg) {

    if (fn != "" && typeof fn == "function") {

        if (fnArg != undefined && fnArg.length > 0) {

            var argLength = fnArg.length;
            var arr = new Array([argLength]);
            $(fnArg).each(function (index) {
                arr[index] = fnArg[index];
            });
            return fn.apply(fn, arr);
        } else {

            return fn();
        }
    }
}

/**
 * js环绕切面
 * @param options
 * @returns {{remove: remove}}
 */

function section(options) {
    var defaults = {
        object: window,
        methodName: '',
        preposition: '',
        prepositionArg: [],
        postposition: '',
        postpositionArg: [],
        hasRuturn: false,

    };
    options = $.extend(defaults, options);


    var exist = options.object[options.methodName];
    var previous = function () {
        return exist.apply(options.object, arguments);
    };
    var advised = function advice() {
        var res = undefined;
        if (options.preposition != '' && typeof(options.preposition) == 'function') {
            options.prepositionArg.unshift(arguments[0]);
            if (executeFn(options.preposition, options.prepositionArg)) {
                console.log('stop');
                return;
            }
        }
        res = previous.apply(this, arguments);
        if (options.postposition != '' && typeof(options.postposition) == 'function') {
            options.postpositionArg.unshift(arguments[0]);
            executeFn(options.postposition, options.postpositionArg);
        }
        return options.hasRuturn === true ? res : undefined;
    }
    options.object[options.methodName] = function () {
        return advised ? advised.apply(options.object, arguments) : previous.apply(options.object, arguments);
    };

    return {
        remove: function () {
            advised = null;
            advice = null;
        }
    }


}