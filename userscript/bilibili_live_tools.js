/**
 * Created by qw4wer on 2016/1/22.
 */

// ==UserScript==
// @name         bili.live 直播工具
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  b站直播观看工具
// @author       qw4wer
// @include      http://live.bilibili.com/*
// @grant       unsafeWindow
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @run-at      document-idle

// @resource    danmuHtml https://raw.githubusercontent.com/qw4wer/com.qw4wer.bili.live.tools/master/html/bili.live.full.screen.danmu.html
// @resource    panelHtml https://raw.githubusercontent.com/qw4wer/com.qw4wer.bili.live.tools/master/html/bili.live.panel.button.html
// @resource    css https://raw.githubusercontent.com/qw4wer/com.qw4wer.bili.live.tools/master/css/bili.live.tools.css
// @resource    utilsJs https://raw.githubusercontent.com/qw4wer/com.qw4wer.bili.live.tools/master/js/com.qw4wer.utils.js
// @resource    toolsJs https://raw.githubusercontent.com/qw4wer/com.qw4wer.bili.live.tools/master/js/bili.live.tools.js
// ==/UserScript==
//debugger;
$ = $ || unsafeWindow.$;
document = document || unsafeWindow.document;
(function () {
    var isOther = location.href.indexOf('http://live.bilibili.com') == -1;

    if (!isOther) {
        setTimeout(function () {
            loadTools();
        }, 2000);

    } else {

    }

})();


function loadTools() {
    console.log("tools start init");
    //加载css
    var css = GM_getResourceText("css");
    GM_addStyle(css);
    //加载按钮面板
    var panel = GM_getResourceText("panelHtml");

    $("#chat-ctrl-panel .btns").append(panel);

    //加载页面方法
    loadJs(GM_getResourceText("utilsJs"));

    var vm = avalon.define({
        $id: "tools_panel",
        fullScreen: function () {
            vm.hasFullScreen = !vm.hasFullScreen;
        },
        cleanGift: function () {
            vm.hasHiddenGift = !vm.hasHiddenGift;
        },
        hiddenSuperGift: function () {
            vm.hasHiddenSuperGift = !vm.hasHiddenSuperGift;
        },
        addDanmu: function () {
            vm.hasAddDanmu = !vm.hasAddDanmu;
        },
        showToolPanel: function () {
            vm.hasShowToolsPanel = !vm.hasShowToolsPanel;
        },
        hasShowToolsPanel: false,
        hasHiddenGift: false,
        hasFullScreen: false,
        hasHiddenSuperGift: false,
        hasAddDanmu: false,
        init:function(){
            vm.$watch("hasShowToolsPanel", function (e) {
                e ? $(document.body).addClass("tools-panel") : $(document.body).removeClass("tools-panel");
            });
            vm.$watch("hasFullScreen", function (e) {
                e ? $(document.body).addClass("full-win") : $(document.body).removeClass("full-win");
            });
            vm.$watch("hasHiddenGift", function (e) {
                e ? $(document.body).addClass("hidden-gift") : $(document.body).removeClass("hidden-gift");
            });
            vm.$watch("hasHiddenSuperGift", function (e) {
                e ? $(document.body).addClass("hidden-supper-gift") : $(document.body).removeClass("hidden-supper-gift");
            });
            vm.$watch("hasAddDanmu", function (e) {
                e ? ($(document.body).addClass("add-danmu"),addDanmuPanel()) : $(document.body).removeClass("add-danmu"),removeDanmuPanel();
            });


        }
    });





    //弹幕控制初始化
    //var prototypeSource = GM_getResourceText("danmuHtml");
    //
    //console.log(prototypeSource);

    avalon.scan();
}

/**
 * 加载js 到页面
 * @param jsStr
 */

function loadJs(jsStr) {
    var oHead = document.getElementsByTagName('HEAD')[0],
        oScript = document.createElement('script');
    oScript.type = 'text/javascript';
    oScript.text = jsStr;
    oHead.appendChild(oScript);
}

