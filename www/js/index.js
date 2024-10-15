var angularapp = angular.module('app', ['ui.router'
                                        ,'ui.utils.masks'
                                        ,'app.controllers'
                                        ,'app.routes'])

document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    StatusBar.styleLightContent();

    document.addEventListener("backbutton", function (e) {
        e.preventDefault();
    }, false );
}

function replaceAll(str, needle, replacement) {
    if(str == null || str == ''){
        return ''
    }else if (str.split(needle).length > 1) {
        return str.split(needle).join(replacement);
    } else {
        return str;
    }
}

var load = {
    show: function (msg) {
        if (msg == undefined) {
            msg = "Aguarde...";
        }
        
        document.getElementById("YMSLoad").style.display = "initial";
        document.getElementById("YMSLoadText").innerText = msg;
    },
    hide: function () {
        document.getElementById("YMSLoad").style.display = "none";
        document.getElementById("YMSLoadText").innerText = "";
    }
};