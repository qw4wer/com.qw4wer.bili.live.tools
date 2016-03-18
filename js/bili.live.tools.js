/**
 * Created by qw4wer on 2016/3/1.
 */
function danmuPanelHandler() {
    var vm = avalon.define({
        $id: 'danmuHandler',
        danmu: {
            msg: ''
        },
        fontSize: 12,
        arr: [],
        maxTop: 200,
        getRationalTop: function getRationalTop() {
            return vm.arr.indexOf(Math.min.apply(null, vm.arr));
        },
        /**
         * 处理回车事件
         * @param event
         */
        inputEvent: function (event) {
            event.keyCode === 13 && vm.send(event);
        },
        /**
         * 处理自己的发送弹幕
         * @param event
         */
        send: function (event) {
            var top = vm.getRationalTop();
            var text = $(event.srcElement).val();
            $(event.srcElement).val("");
            var danmu = vm.danmu;
            danmu.msg = text;
            vm.sendHandel(danmu);
        },
        /**
         * 处理flash传递的弹幕
         * @param danmu
         */
        flagNativSend: function (danmu) {
            var danmuMsg = '';
            if (danmu) {
                vm.sendHandel(danmu);
            }

        },
        /**
         * 处理弹幕
         * @param danmu
         */
        sendHandel: function (danmu) {
            if ($("#danmuArea .danmu-hidden").size() === 0) {
                var msg = $("<div class='danmu' ></div>");
                msg.addClass("danmu").html(danmu.msg).css({top: top * vm.fontSize});
                vm.arr[top] = vm.arr[top] + 1 || 1;
                $("#danmuArea").append(msg);
            } else {
                msg = $("#danmuArea .danmu-hidden:first");
                msg.addClass("danmu").html(danmu.msg).removeClass("danmu-hidden").css({top: top * vm.fontSize});
                vm.arr[top] = vm.arr[top] + 1 || 1;
            }
            msg.unbind().bind('webkitAnimationEnd', function (event) {
                $(this).addClass("danmu-hidden").removeClass("danmu");
                vm.arr[Math.ceil($(this).css('top').substring(0, $(this).css('top').indexOf("p")) / vm.fontSize)]--;
            });
        },
        /**
         * 初始化弹幕池
         */
        init: function () {
            for (var i = 0; i < Math.ceil(vm.maxTop / vm.fontSize); i++) {
                vm.arr[i] = 0;
            }
        }
    });

    vm.init();
    return vm;
}

function addDanmuPanel() {
    $(body).append($(".danmu-panel"));
    addSection(unsafeWindow.liveRoomFuncs, "addDanmu", danmuHandler);

}

function removeDanmuPanel(){
    $(".danmu-panel").remove();
    sections.remove();
}

function addSection(object, methodName, handel) {
    console.log('addSection');
    sections = section({
        object: object,
        methodName: methodName,
        preposition: function (args) {
            executeFn(handel, [args]);
        },
        postposition: function (args) {

        }

    });

}
/**
 * 弹幕处理
 * @param args
 */
function danmuHandler(danmu) {
    avalon.vmodels['danmuHandler'].$fire('flagNativSend', danmu);
}
