(function() {
    var webview = document.querySelector('webview');

    webview.addEventListener('permissionrequest', function (e) {
        console.log("webview requested " + e.permission);
        e.request.allow();
        //appWin.drawAttention();
        //chrome.browserAction.setBadgeText("12")
    });

    webview.addEventListener('contentload', function (e) {
        console.log('Starting poller');

        download("../guest/trap-notification.js", function(content){
            var code = 'var script = document.createElement("script");' +
                    'script.innerHTML="eval(atob(\''+ btoa(content) + '\'))";' +
                    'document.head.appendChild(script);';
            webview.executeScript(
                {
                    code: code
                },function(e){
                    console.log(chrome.runtime.lastError);
                }
            );
        });


        webview.executeScript(
            {
                file: 'guest/guest-injection.js'
            }
        )
    });

    webview.addEventListener('newwindow', function (e) {
        window.open(e.targetUrl, '_blank');
    });

    function replace(str, search, replace) {
        return str.split(search).join(replace);
    }

    function download(url, callback) {
        var oReq = new XMLHttpRequest();
        //oReq.responseType = 'arraybuffer';
        oReq.onload = function(){callback(oReq.response)};
        oReq.open("get", url, true);
        oReq.send();
    }
}());
